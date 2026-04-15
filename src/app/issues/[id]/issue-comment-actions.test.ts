import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"

vi.mock("@/http/create-comment", () => ({
  createComment: vi.fn().mockResolvedValue(undefined),
}))

describe("addIssueComment", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("delegates to createComment", async () => {
    const { createComment } = await import("@/http/create-comment")
    const { addIssueComment } = await import("./issue-comment-actions")
    await addIssueComment(ISSUE_ID_A, "from action")
    expect(createComment).toHaveBeenCalledWith({
      issueId: ISSUE_ID_A,
      text: "from action",
    })
  })
})
