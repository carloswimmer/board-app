import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { ISSUE_ID_A, mockSession, mockUser } from "@/test/fixtures"
import type { AuthSession } from "../auth"
import { getIssueInteractions } from "./get-issue-interactions"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
  },
}))

import { db } from "../db"

type Vars = {
  user: AuthSession["user"] | null
  session: AuthSession["session"] | null
}

function mount(vars: Vars) {
  const app = new OpenAPIHono<{ Variables: Vars }>()
  app.use(async (c, next) => {
    c.set("user", vars.user)
    c.set("session", vars.session)
    await next()
  })
  app.route("/", getIssueInteractions)
  return app
}

describe("getIssueInteractions route", () => {
  it("returns empty when no ids after filter", async () => {
    const app = mount({ user: null, session: null })
    const res = await app.request("http://localhost/issues/interactions?issueIds=")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.interactions).toEqual([])
  })

  it("returns interactions without user likes query", async () => {
    vi.mocked(db.select).mockReturnValue(
      makeSelectFromRows([{ id: ISSUE_ID_A, likes: 5 }]),
    )
    const app = mount({ user: null, session: null })
    const res = await app.request(
      `http://localhost/issues/interactions?issueIds=${ISSUE_ID_A}`,
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.interactions[0].likesCount).toBe(5)
    expect(body.interactions[0].isLiked).toBe(false)
  })

  it("marks liked issues for authenticated user", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectFromRows([{ id: ISSUE_ID_A, likes: 2 }]),
      )
      .mockReturnValueOnce(
        makeSelectFromRows([{ issueId: ISSUE_ID_A }]),
      )

    const app = mount({
      user: mockUser as AuthSession["user"],
      session: mockSession as AuthSession["session"],
    })
    const res = await app.request(
      `http://localhost/issues/interactions?issueIds=${ISSUE_ID_A}`,
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.interactions[0].isLiked).toBe(true)
  })
})
