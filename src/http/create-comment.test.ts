import { beforeEach, describe, expect, it, vi } from "vitest"
import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { ISSUE_ID_A, createdAt } from "@/test/fixtures"

describe("createComment http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("posts comment and revalidates tag", async () => {
    vi.mocked(headers).mockResolvedValue(new Headers({ cookie: "s=1" }))

    const payload = {
      id: "770e8400-e29b-41d4-a716-446655440002",
      issueId: ISSUE_ID_A,
      author: { name: "A", avatar: "https://x.com/a.png" },
      text: "Hi",
      createdAt: createdAt.toISOString(),
    }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))),
    )

    const { createComment } = await import("./create-comment")
    const result = await createComment({ issueId: ISSUE_ID_A, text: "Hi" })
    expect(result.text).toBe("Hi")
    expect(updateTag).toHaveBeenCalledWith(`issue-comments-${ISSUE_ID_A}`)
  })
})
