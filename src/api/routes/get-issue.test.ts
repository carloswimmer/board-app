import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"
import { getIssue } from "./get-issue"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    $count: vi.fn(),
  },
}))

import { db } from "../db"

describe("getIssue route", () => {
  const issueRow = {
    id: ISSUE_ID_A,
    issueNumber: 1,
    title: "T",
    description: "D",
    status: "backlog" as const,
    likes: 0,
    createdAt,
  }

  beforeEach(() => {
    vi.mocked(db.$count).mockResolvedValue(4)
  })

  it("returns 404 when issue missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = new OpenAPIHono().route("/", getIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`)
    expect(res.status).toBe(404)
  })

  it("returns issue with comment count", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([issueRow]))
    const app = new OpenAPIHono().route("/", getIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(ISSUE_ID_A)
    expect(body.comments).toBe(4)
  })
})
