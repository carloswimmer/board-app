import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getIssueInteractions } from "@/http/get-issue-interactions"
import { ISSUE_ID_A } from "@/test/fixtures"
import { BoardColumn } from "./board-column"

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  )
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: {
        interactions: [{ issueId: ISSUE_ID_A, isLiked: false, likesCount: 2 }],
      },
      isLoading: false,
    })),
  }
})

vi.mock("@/http/get-issue-interactions", () => ({
  getIssueInteractions: vi.fn(),
}))

function wrap(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>
}

describe("BoardColumn", () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        interactions: [{ issueId: ISSUE_ID_A, isLiked: false, likesCount: 2 }],
      },
      isLoading: false,
    })
  })

  it("shows empty state", () => {
    render(wrap(<BoardColumn title="Backlog" issues={[]} className="bg-x" />))
    expect(
      screen.getByText("No issues found for this section"),
    ).toBeInTheDocument()
  })

  it("renders issue cards", () => {
    render(
      wrap(
        <BoardColumn
          title="Backlog"
          className="bg-x"
          issues={[
            {
              id: ISSUE_ID_A,
              issueNumber: 1,
              title: "Issue one",
              status: "backlog",
              comments: 0,
            },
          ]}
        />,
      ),
    )
    expect(screen.getByText("Issue one")).toBeInTheDocument()
  })

  it("builds query function with all issue ids", async () => {
    render(
      wrap(
        <BoardColumn
          title="Backlog"
          className="bg-x"
          issues={[
            {
              id: ISSUE_ID_A,
              issueNumber: 1,
              title: "Issue one",
              status: "backlog",
              comments: 0,
            },
          ]}
        />,
      ),
    )

    const firstCall = vi.mocked(useQuery).mock.calls[0]?.[0]
    expect(firstCall?.queryKey).toEqual(["issue-likes", ISSUE_ID_A])
    await firstCall?.queryFn()
    expect(getIssueInteractions).toHaveBeenCalledWith({
      issueIds: [ISSUE_ID_A],
    })
  })

  it("uses empty interactions while query is loading", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    })
    render(
      wrap(
        <BoardColumn
          title="Backlog"
          className="bg-x"
          issues={[
            {
              id: ISSUE_ID_A,
              issueNumber: 1,
              title: "Issue one",
              status: "backlog",
              comments: 0,
            },
          ]}
        />,
      ),
    )
    expect(screen.getByText("Issue one")).toBeInTheDocument()
  })
})
