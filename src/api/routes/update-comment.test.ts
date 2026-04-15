import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { COMMENT_ID_A, ISSUE_ID_A, createdAt, mockSession, mockUser } from "@/test/fixtures"
import type { AuthSession } from "../auth"
import { updateComment } from "./update-comment"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
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
  app.route("/", updateComment)
  return app
}

describe("updateComment route", () => {
  it("returns 404 when comment missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments/${COMMENT_ID_A}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "x" }),
      },
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
            authorName: "SomeoneElse",
            authorAvatar: "https://x.com/a.png",
            text: "Old",
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
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "x" }),
      },
    )
    expect(res.status).toBe(403)
  })

  it("updates comment when author matches", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectFromRows([
          {
            id: COMMENT_ID_A,
            issueId: ISSUE_ID_A,
            authorName: mockUser.name,
            authorAvatar: "https://x.com/a.png",
            text: "Old",
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

    vi.mocked(db.update).mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () =>
            Promise.resolve([
              {
                id: COMMENT_ID_A,
                issueId: ISSUE_ID_A,
                authorName: mockUser.name,
                authorAvatar: "https://x.com/a.png",
                text: "New text",
                createdAt,
              },
            ]),
        }),
      }),
    } as never)

    const app = mount()
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments/${COMMENT_ID_A}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "New text" }),
      },
    )
    expect(res.status).toBe(200)
  })
})
