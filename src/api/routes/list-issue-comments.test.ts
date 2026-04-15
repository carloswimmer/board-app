import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"
import { listIssueComments } from "./list-issue-comments"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    $count: vi.fn(),
  },
}))

import { db } from "../db"

describe("listIssueComments route", () => {
  const issue = {
    id: ISSUE_ID_A,
    issueNumber: 1,
    title: "T",
    description: "D",
    status: "backlog" as const,
    likes: 0,
    createdAt,
  }

  const commentRow = {
    id: "770e8400-e29b-41d4-a716-446655440002",
    issueId: ISSUE_ID_A,
    authorName: "Bob",
    authorAvatar: "https://example.com/a.png",
    text: "Hi",
    createdAt,
  }

  beforeEach(() => {
    vi.mocked(db.$count).mockResolvedValue(1)
  })

  it("returns 404 when issue missing", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([]))
    const app = new OpenAPIHono().route("/", listIssueComments)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}/comments`)
    expect(res.status).toBe(404)
  })

  it("returns paginated comments", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(makeSelectFromRows([issue]))
      .mockReturnValueOnce(makeSelectFromRows([commentRow]))

    const app = new OpenAPIHono().route("/", listIssueComments)
    const res = await app.request(
      `http://localhost/issues/${ISSUE_ID_A}/comments?limit=10&offset=0`,
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.comments).toHaveLength(1)
    expect(body.total).toBe(1)
    expect(body.limit).toBe(10)
    expect(body.offset).toBe(0)
  })
})
