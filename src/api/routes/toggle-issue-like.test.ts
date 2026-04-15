import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { ISSUE_ID_A, createdAt, mockSession, mockUser } from "@/test/fixtures"
import type { AuthSession } from "../auth"
import { toggleIssueLike } from "./toggle-issue-like"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

import { db } from "../db"

type Vars = {
  user: AuthSession["user"] | null
  session: AuthSession["session"] | null
}

function mount() {
  const app = new OpenAPIHono<{ Variables: Vars }>()
  app.use(async (c, next) => {
    c.set("user", mockUser as AuthSession["user"])
    c.set("session", mockSession as AuthSession["session"])
    await next()
  })
  app.route("/", toggleIssueLike)
  return app
}

const issueRow = {
  id: ISSUE_ID_A,
  issueNumber: 1,
  title: "T",
  description: "D",
  status: "backlog" as const,
  likes: 5,
  createdAt,
}

describe("toggleIssueLike route", () => {
  it("returns 404 when issue missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = mount()
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}/like`, {
      method: "POST",
    })
    expect(res.status).toBe(404)
  })

  it("unlikes when like exists", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(makeSelectFromRows([issueRow]))
      .mockReturnValueOnce(
        makeSelectFromRows([
          { id: "like-1", issueId: ISSUE_ID_A, userId: mockUser.id },
        ]),
      )
      .mockReturnValueOnce(makeSelectFromRows([{ ...issueRow, likes: 4 }]))

    vi.mocked(db.delete).mockReturnValue({
      where: () => Promise.resolve(),
    } as never)
    vi.mocked(db.update).mockReturnValue({
      set: () => ({
        where: () => Promise.resolve(),
      }),
    } as never)

    const app = mount()
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}/like`, {
      method: "POST",
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.liked).toBe(false)
  })

  it("likes when no existing like", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(makeSelectFromRows([issueRow]))
      .mockReturnValueOnce(makeSelectFromRows([]))
      .mockReturnValueOnce(makeSelectFromRows([{ ...issueRow, likes: 6 }]))

    vi.mocked(db.insert).mockReturnValue({
      values: () => Promise.resolve(),
    } as never)
    vi.mocked(db.update).mockReturnValue({
      set: () => ({
        where: () => Promise.resolve(),
      }),
    } as never)

    const app = mount()
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}/like`, {
      method: "POST",
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.liked).toBe(true)
  })
})
