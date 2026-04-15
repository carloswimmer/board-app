import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A, createdAt, mockSession, mockUser } from "@/test/fixtures"
import type { AuthSession } from "../auth"
import { createComment } from "./create-comment"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
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
  app.route("/", createComment)
  return app
}

const issueRow = {
  id: ISSUE_ID_A,
  issueNumber: 1,
  title: "T",
  description: "D",
  status: "backlog" as const,
  likes: 0,
  createdAt,
}

describe("createComment route", () => {
  it("returns 404 when issue missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello" }),
      },
    )
    expect(res.status).toBe(404)
  })

  it("uses empty avatar when user has no image", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([issueRow]))
    vi.mocked(db.insert).mockReturnValue({
      values: () => ({
        returning: () =>
          Promise.resolve([
            {
              id: "770e8400-e29b-41d4-a716-446655440002",
              issueId: ISSUE_ID_A,
              authorName: mockUser.name,
              authorAvatar: "",
              text: "Hello",
              createdAt,
            },
          ]),
      }),
    } as never)

    const userNoImage = { ...mockUser, image: null as string | null }
    const app = new OpenAPIHono<{ Variables: Vars }>()
    app.use(async (c, next) => {
      c.set("user", userNoImage as AuthSession["user"])
      c.set("session", mockSession as AuthSession["session"])
      await next()
    })
    app.route("/", createComment)
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello" }),
      },
    )
    expect(res.status).toBe(201)
  })

  it("creates comment", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([issueRow]))
    vi.mocked(db.insert).mockReturnValue({
      values: () => ({
        returning: () =>
          Promise.resolve([
            {
              id: "770e8400-e29b-41d4-a716-446655440002",
              issueId: ISSUE_ID_A,
              authorName: mockUser.name,
              authorAvatar: mockUser.image ?? "",
              text: "Hello",
              createdAt,
            },
          ]),
      }),
    } as never)

    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello" }),
      },
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.text).toBe("Hello")
  })
})
