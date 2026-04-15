import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { COMMENT_ID_A, ISSUE_ID_A, createdAt, mockSession, mockUser } from "@/test/fixtures"
import type { AuthSession } from "../auth"
import { deleteComment } from "./delete-comment"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
  },
}))

import { db } from "../db"
import { makeSelectFromRows } from "@/test/drizzle-mocks"

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
  app.route("/", deleteComment)
  return app
}

describe("deleteComment route", () => {
  it("returns 404 when comment missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments/${COMMENT_ID_A}`,
      { method: "DELETE" },
    )
    expect(res.status).toBe(404)
  })

  it("returns 403 when not author", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectFromRows([
          {
            id: COMMENT_ID_A,
            issueId: ISSUE_ID_A,
            authorName: "Other",
            authorAvatar: "https://x.com/a.png",
            text: "x",
            createdAt,
          },
        ]),
      )
      .mockReturnValueOnce(
        makeSelectFromRows([
          {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
          },
        ]),
      )

    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments/${COMMENT_ID_A}`,
      { method: "DELETE" },
    )
    expect(res.status).toBe(403)
  })

  it("deletes when author matches", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectFromRows([
          {
            id: COMMENT_ID_A,
            issueId: ISSUE_ID_A,
            authorName: mockUser.name,
            authorAvatar: "https://x.com/a.png",
            text: "x",
            createdAt,
          },
        ]),
      )
      .mockReturnValueOnce(
        makeSelectFromRows([
          {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
          },
        ]),
      )

    vi.mocked(db.delete).mockReturnValue({
      where: () => Promise.resolve(),
    } as never)

    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments/${COMMENT_ID_A}`,
      { method: "DELETE" },
    )
    expect(res.status).toBe(204)
  })
})
