import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"

vi.mock("@/http/create-comment", () => ({
  createComment: vi.fn().mockResolvedValue(undefined),
}))

describe("createIssueCommentAction", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("delegates to createComment", async () => {
    const { createComment } = await import("@/http/create-comment")
    const { createIssueCommentAction } = await import("./actions")
    await createIssueCommentAction(ISSUE_ID_A, "hello")
    expect(createComment).toHaveBeenCalledWith({
      issueId: ISSUE_ID_A,
      text: "hello",
    })
  })
})
