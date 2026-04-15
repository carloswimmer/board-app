import { useQuery } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"
import { IssueLikeButton } from "./issue-like-button"

vi.mock("@tanstack/react-query", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-query")>(
      "@tanstack/react-query",
    )
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock("@/http/get-issue-interactions", () => ({
  getIssueInteractions: vi.fn(),
}))

vi.mock("@/hook/useLikeMutation", () => ({
  useLikeMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

describe("IssueLikeButton", () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        interactions: [{ issueId: ISSUE_ID_A, isLiked: true, likesCount: 4 }],
      },
      isLoading: false,
    })
  })

  it("renders likes from interactions payload", () => {
    render(<IssueLikeButton issueId={ISSUE_ID_A} />)
    expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument()
    expect(screen.getByText("4")).toBeInTheDocument()
  })

  it("falls back to default values when interaction is missing", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { interactions: [] },
      isLoading: false,
    })
    render(<IssueLikeButton issueId={ISSUE_ID_A} />)
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument()
    expect(screen.getByText("0")).toBeInTheDocument()
  })
})
