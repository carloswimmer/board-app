import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { createdAt, ISSUE_ID_A } from "@/test/fixtures"

const createComment = vi.fn().mockResolvedValue(undefined)
const issueCommentFormProps: {
  onCreateComment: undefined | ((text: string) => Promise<void>)
  isAuthenticated: boolean
} = vi.hoisted(() => ({
  onCreateComment: undefined,
  isAuthenticated: false,
}))

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}))

vi.mock("@/http/get-issue", () => ({
  getIssue: vi.fn().mockResolvedValue({
    id: ISSUE_ID_A,
    issueNumber: 7,
    title: "Issue title",
    description: "Issue description",
    status: "backlog",
    comments: 0,
    createdAt: createdAt.toISOString(),
  }),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: vi.fn().mockResolvedValue({ data: null }),
  },
}))

vi.mock("@/http/create-comment", () => ({
  createComment: (payload: { issueId: string; text: string }) =>
    createComment(payload),
}))

vi.mock("./issue-comments/issue-comments-list", () => ({
  IssueCommentsList: () => <div>comments</div>,
}))

vi.mock("./issue-comments/issue-comments-skeleton", () => ({
  IssueCommentsSkeleton: () => <div>skeleton</div>,
}))

vi.mock("./issue-like-button", () => ({
  IssueLikeButton: () => <button type="button">Like</button>,
}))

vi.mock("./issue-comment-form", () => ({
  IssueCommentForm: (props: {
    onCreateComment: (text: string) => Promise<void>
    isAuthenticated: boolean
  }) => {
    issueCommentFormProps.onCreateComment = props.onCreateComment
    issueCommentFormProps.isAuthenticated = props.isAuthenticated
    return <div>form</div>
  },
}))

describe("IssueDetails", () => {
  it("creates onCreateComment handler bound to issue id", async () => {
    const { IssueDetails } = await import("./issue-details")
    render(await IssueDetails({ issueId: ISSUE_ID_A }))
    expect(issueCommentFormProps.isAuthenticated).toBe(false)

    await issueCommentFormProps.onCreateComment?.("hello")
    expect(createComment).toHaveBeenCalledWith({
      issueId: ISSUE_ID_A,
      text: "hello",
    })
  })
})
