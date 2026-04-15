import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"

describe("listIssueComments http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("fetches comments list", async () => {
    const payload = {
      comments: [
        {
          id: "770e8400-e29b-41d4-a716-446655440002",
          issueId: ISSUE_ID_A,
          author: { name: "A", avatar: "https://x.com/a.png" },
          text: "Hi",
          createdAt: createdAt.toISOString(),
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))),
    )
    const { listIssueComments } = await import("./list-issue-comments")
    const result = await listIssueComments({ issueId: ISSUE_ID_A })
    expect(result.comments).toHaveLength(1)
  })
})
