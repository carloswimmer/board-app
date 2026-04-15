import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"

describe("listIssues http", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("fetches and parses grouped issues", async () => {
    const payload = {
      backlog: [
        {
          id: ISSUE_ID_A,
          issueNumber: 1,
          title: "T",
          status: "backlog",
          comments: 0,
        },
      ],
      todo: [],
      in_progress: [],
      done: [],
    }
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(payload), { status: 200 }),
        ),
    )

    const { listIssues } = await import("./list-issues")
    const result = await listIssues()
    expect(result.backlog).toHaveLength(1)
    expect(fetch).toHaveBeenCalled()
  })

  it("passes search and sort params", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            backlog: [],
            todo: [],
            in_progress: [],
            done: [],
          }),
        ),
      ),
    )
    const { listIssues } = await import("./list-issues")
    await listIssues({ search: "x", sort: "issueNumber", direction: "desc" })
    const url = String(vi.mocked(fetch).mock.calls[0][0])
    expect(url).toContain("search=x")
    expect(url).toContain("sort=issueNumber")
    expect(url).toContain("direction=desc")
  })
})
