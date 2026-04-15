import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"

describe("toggleLike http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("POSTs like toggle and parses response", async () => {
    const payload = {
      id: ISSUE_ID_A,
      likes: 3,
      liked: true,
    }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))),
    )
    const { toggleLike } = await import("./toggle-like")
    const result = await toggleLike({ issueId: ISSUE_ID_A })
    expect(result.liked).toBe(true)
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({
      method: "POST",
    })
  })
})
