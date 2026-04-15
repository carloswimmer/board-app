import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"

describe("getIssueInteractions http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("fetches interactions with credentials", async () => {
    const payload = {
      interactions: [
        {
          issueId: ISSUE_ID_A,
          isLiked: false,
          likesCount: 1,
        },
      ],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(payload)))
    vi.stubGlobal("fetch", fetchMock)

    const { getIssueInteractions } = await import("./get-issue-interactions")
    const result = await getIssueInteractions({ issueIds: [ISSUE_ID_A] })
    expect(result.interactions).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ credentials: "include" }),
    )
  })
})
