import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"

describe("getIssue http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("fetches and parses issue", async () => {
    const payload = {
      id: ISSUE_ID_A,
      issueNumber: 1,
      title: "T",
      description: "D",
      status: "backlog",
      comments: 0,
      createdAt: createdAt.toISOString(),
    }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))),
    )
    const { getIssue } = await import("./get-issue")
    const result = await getIssue({ id: ISSUE_ID_A })
    expect(result.id).toBe(ISSUE_ID_A)
  })
})
