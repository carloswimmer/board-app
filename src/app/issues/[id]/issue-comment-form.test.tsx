import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { IssueCommentForm } from "./issue-comment-form"

describe("IssueCommentForm", () => {
  it("shows sign-in placeholder and disables submit for guests", () => {
    render(
      <IssueCommentForm
        isAuthenticated={false}
        onCreateComment={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(
      screen.getByPlaceholderText("Sign in to comment..."),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /publish/i })).toBeDisabled()
  })

  it("shows validation error for empty comment", async () => {
    const user = userEvent.setup()
    render(
      <IssueCommentForm
        isAuthenticated
        onCreateComment={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    await user.click(screen.getByRole("button", { name: /publish/i }))
    expect(
      await screen.findByText("Comment can not be empty"),
    ).toBeInTheDocument()
  })
})
