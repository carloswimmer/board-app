import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { ISSUE_ID_A, ISSUE_ID_B, createdAt } from "@/test/fixtures"
import { listIssues } from "./list-issues"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    $count: vi.fn(),
  },
}))

import { db } from "../db"

describe("listIssues route", () => {
  const rowA = {
    id: ISSUE_ID_A,
    issueNumber: 1,
    title: "Alpha",
    status: "backlog" as const,
    description: "d",
    likes: 0,
    createdAt,
  }
  const rowB = {
    id: ISSUE_ID_B,
    issueNumber: 2,
    title: "Beta",
    status: "todo" as const,
    description: "d",
    likes: 0,
    createdAt,
  }

  beforeEach(() => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([rowA, rowB]))
    vi.mocked(db.$count).mockResolvedValue(3)
  })

  it("returns issues grouped by status", async () => {
    const app = new OpenAPIHono().route("/", listIssues)
    const res = await app.request("http://localhost/issues")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.backlog).toHaveLength(1)
    expect(body.todo).toHaveLength(1)
    expect(body.in_progress).toHaveLength(0)
    expect(body.done).toHaveLength(0)
    expect(body.backlog[0].comments).toBe(3)
  })

  it("filters by status query", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([rowA]))
    const app = new OpenAPIHono().route("/", listIssues)
    const res = await app.request("http://localhost/issues?status=backlog")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.backlog).toHaveLength(1)
  })

  it("filters by search", async () => {
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([rowA]))
    const app = new OpenAPIHono().route("/", listIssues)
    const res = await app.request("http://localhost/issues?search=Alpha")
    expect(res.status).toBe(200)
  })

  it("sorts by issueNumber desc", async () => {
    const app = new OpenAPIHono().route("/", listIssues)
    const res = await app.request(
      "http://localhost/issues?sort=issueNumber&direction=desc",
    )
    expect(res.status).toBe(200)
  })

  it("sorts by issueNumber asc", async () => {
    const app = new OpenAPIHono().route("/", listIssues)
    const res = await app.request(
      "http://localhost/issues?sort=issueNumber&direction=asc",
    )
    expect(res.status).toBe(200)
  })
})
