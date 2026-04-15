import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"
import { deleteIssue } from "./delete-issue"

vi.mock("../db", () => ({
  db: {
    delete: vi.fn(),
  },
}))

import { db } from "../db"

describe("deleteIssue route", () => {
  it("returns 404 when nothing deleted", async () => {
    vi.mocked(db.delete).mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    } as never)

    const app = new OpenAPIHono().route("/", deleteIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(404)
  })

  it("returns 204 when deleted", async () => {
    vi.mocked(db.delete).mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([{ id: ISSUE_ID_A }]),
      }),
    } as never)

    const app = new OpenAPIHono().route("/", deleteIssue)
    const res = await app.request(`http://localhost/issues/${ISSUE_ID_A}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(204)
  })
})
