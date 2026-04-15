import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createdAt, ISSUE_ID_A } from "@/test/fixtures"
import { updateIssue } from "./update-issue"

vi.mock("../db", () => ({
  db: {
    update: vi.fn(),
    $count: vi.fn(),
  },
}))

import { db } from "../db"

describe("updateIssue route", () => {
  const updated = {
    id: ISSUE_ID_A,
    issueNumber: 1,
    title: "T2",
    description: "D2",
    status: "todo" as const,
    likes: 1,
    createdAt,
  }

  beforeEach(() => {
    vi.mocked(db.$count).mockResolvedValue(2)
  })

  it("returns 404 when issue missing", async () => {
    vi.mocked(db.update).mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
    } as never)

    const app = new OpenAPIHono().route("/", updateIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "x" }),
    })
    expect(res.status).toBe(404)
  })

  it("updates issue fields", async () => {
    vi.mocked(db.update).mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([updated]),
        }),
      }),
    } as never)

    const app = new OpenAPIHono().route("/", updateIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "T2" }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.comments).toBe(2)
  })
})
