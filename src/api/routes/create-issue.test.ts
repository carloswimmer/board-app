import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"
import { createIssue } from "./create-issue"

vi.mock("../db", () => ({
  db: {
    insert: vi.fn(),
  },
}))

import { db } from "../db"

describe("createIssue route", () => {
  const inserted = {
    id: ISSUE_ID_A,
    issueNumber: 1,
    title: "New",
    description: "Body",
    status: "backlog" as const,
    likes: 0,
    createdAt,
  }

  beforeEach(() => {
    vi.mocked(db.insert).mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([inserted]),
      }),
    } as never)
  })

  it("creates issue with defaults", async () => {
    const app = new OpenAPIHono().route("/", createIssue)
    const res = await app.request("http://localhost/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New",
        description: "Body",
      }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.comments).toBe(0)
    expect(body.title).toBe("New")
  })

  it("accepts explicit status", async () => {
    const app = new OpenAPIHono().route("/", createIssue)
    const res = await app.request("http://localhost/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New",
        description: "Body",
        status: "done",
      }),
    })
    expect(res.status).toBe(201)
  })
})
