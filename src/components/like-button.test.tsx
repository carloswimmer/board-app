import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { LikeButton } from "./like-button"

const mutate = vi.fn()
vi.mock("@/hook/useLikeMutation", () => ({
  useLikeMutation: () => ({ mutate, isPending: false }),
}))

describe("LikeButton", () => {
  it("calls mutate on click", async () => {
    const user = userEvent.setup()
    render(
      <LikeButton issueId="550e8400-e29b-41d4-a716-446655440000" initialLikes={2} />,
    )
    await user.click(screen.getByRole("button", { name: /like/i }))
    expect(mutate).toHaveBeenCalled()
  })

  it("uses Unlike label when liked", () => {
    render(
      <LikeButton
        issueId="550e8400-e29b-41d4-a716-446655440000"
        initialLikes={1}
        initialLiked
      />,
    )
    expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument()
  })
})
