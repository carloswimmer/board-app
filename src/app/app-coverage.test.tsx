import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { createdAt, ISSUE_ID_A } from "@/test/fixtures"

const listIssueCommentsMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    comments: [],
    total: 0,
    limit: 50,
    offset: 0,
  }),
)

vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(
      public _jsx: unknown,
      public _opts: unknown,
    ) {}
  },
}))

vi.mock("@/app/(board)/header/header", () => ({
  Header: () => <div data-testid="board-header" />,
}))

vi.mock("@/app/issues/header/header", () => ({
  Header: () => <div data-testid="issues-header" />,
}))

vi.mock("@/http/list-issues", () => ({
  listIssues: vi.fn().mockResolvedValue({
    backlog: [],
    todo: [],
    in_progress: [],
    done: [],
  }),
}))

vi.mock("@/http/get-issue", () => ({
  getIssue: vi.fn().mockResolvedValue({
    id: ISSUE_ID_A,
    issueNumber: 7,
    title: "Issue title",
    description: "Desc",
    status: "backlog",
    comments: 0,
    createdAt: createdAt.toISOString(),
  }),
}))

vi.mock("@/http/list-issue-comments", () => ({
  listIssueComments: listIssueCommentsMock,
}))

vi.mock("@/http/get-issue-interactions", () => ({
  getIssueInteractions: vi.fn().mockResolvedValue({
    interactions: [{ issueId: ISSUE_ID_A, isLiked: true, likesCount: 3 }],
  }),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: vi.fn().mockResolvedValue({ data: null }),
  },
}))

describe("app pages and layouts", () => {
  it("renders board page", async () => {
    const { default: Board } = await import("./(board)/page")
    const node = await Board({
      searchParams: Promise.resolve({ q: "find" }),
    })
    expect(node).toBeTruthy()
  })

  it("renders board loading", async () => {
    const { default: Loading } = await import("./(board)/loading")
    const node = Loading({})
    expect(node).toBeTruthy()
  })

  it("renders board column skeleton", async () => {
    const { BoardColumnSkeleton } = await import(
      "./(board)/board-column-skeleton"
    )
    const { container } = render(<BoardColumnSkeleton title="Backlog" />)
    expect(container.textContent).toContain("Backlog")
  })

  it("renders board layout", async () => {
    const { default: Layout } = await import("./(board)/layout")
    render(
      <Layout>
        <span>child</span>
      </Layout>,
    )
    expect(screen.getByTestId("board-header")).toBeInTheDocument()
    expect(screen.getByText("child")).toBeInTheDocument()
  })

  it("renders root layout", async () => {
    const { default: RootLayout } = await import("./layout")
    render(
      <RootLayout drawer={<div>drawer</div>}>
        <span>main</span>
      </RootLayout>,
    )
    expect(screen.getByText("main")).toBeInTheDocument()
    expect(screen.getByText("drawer")).toBeInTheDocument()
  })

  it("renders issues layout", async () => {
    const { default: Layout } = await import("./issues/layout")
    render(
      <Layout>
        <span>issue-child</span>
      </Layout>,
    )
    expect(screen.getByTestId("issues-header")).toBeInTheDocument()
  })

  it("renders drawer default", async () => {
    const { default: Def } = await import("./@drawer/default")
    expect(Def()).toBeNull()
  })

  it("renders issue main page and metadata", async () => {
    const issueMod = await import("./issues/[id]/page")
    const meta = await issueMod.generateMetadata({
      params: Promise.resolve({ id: ISSUE_ID_A }),
    })
    expect(meta.title).toContain("Issue")
    const Page = issueMod.default
    const node = await Page({ params: Promise.resolve({ id: ISSUE_ID_A }) })
    expect(node).toBeTruthy()
  })

  it("renders issue loading", async () => {
    const { default: Loading } = await import("./issues/[id]/loading")
    const node = Loading({})
    expect(node).toBeTruthy()
  })

  it("renders issue details server component", async () => {
    const { IssueDetails } = await import("./issues/[id]/issue-details")
    const node = await IssueDetails({ issueId: ISSUE_ID_A })
    expect(node).toBeTruthy()
  })

  it("renders opengraph image component", async () => {
    const { ImageResponse } = await import("next/og")
    const { default: Og } = await import("./issues/[id]/opengraph-image")
    const result = await Og({ params: Promise.resolve({ id: ISSUE_ID_A }) })
    expect(result).toBeInstanceOf(ImageResponse)
  })

  it("renders drawer issue parallel route page", async () => {
    const { default: IssueDrawer } = await import(
      "./@drawer/(.)issues/[id]/page"
    )
    const node = await IssueDrawer({
      params: Promise.resolve({ id: ISSUE_ID_A }),
    })
    expect(node).toBeTruthy()
  })

  it("renders back button", async () => {
    const { BackButton } = await import("./@drawer/(.)issues/[id]/back-button")
    const user = userEvent.setup()
    render(<BackButton />)
    await user.click(screen.getByRole("button", { name: /back to board/i }))
  })

  it("renders issue comments list empty", async () => {
    const { IssueCommentsList } = await import(
      "./issues/[id]/issue-comments/issue-comments-list"
    )
    const node = await IssueCommentsList({ issueId: ISSUE_ID_A })
    expect(node).toBeTruthy()
  })

  it("renders issue comments list with items", async () => {
    listIssueCommentsMock.mockResolvedValueOnce({
      comments: [
        {
          id: "770e8400-e29b-41d4-a716-446655440002",
          issueId: ISSUE_ID_A,
          author: { name: "A", avatar: "https://x.com/a.png" },
          text: "Hi",
          createdAt: createdAt.toISOString(),
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    })
    const { IssueCommentsList } = await import(
      "./issues/[id]/issue-comments/issue-comments-list"
    )
    const node = await IssueCommentsList({ issueId: ISSUE_ID_A })
    expect(node).toBeTruthy()
  })

  it("renders comments skeleton", async () => {
    const { IssueCommentsSkeleton } = await import(
      "./issues/[id]/issue-comments/issue-comments-skeleton"
    )
    const node = IssueCommentsSkeleton({})
    expect(node).toBeTruthy()
  })

  it("renders issue comment form", async () => {
    const { IssueCommentForm } = await import(
      "./issues/[id]/issue-comment-form"
    )
    const user = userEvent.setup()
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(<IssueCommentForm isAuthenticated onCreateComment={onCreate} />)
    await user.type(screen.getByPlaceholderText(/Leave a comment/), "Hi")
    await user.click(screen.getByRole("button", { name: /publish/i }))
    await vi.waitFor(() => expect(onCreate).toHaveBeenCalledWith("Hi"))
  })

  it("renders issue like button with data", async () => {
    vi.mocked(
      (await import("@/http/get-issue-interactions")).getIssueInteractions,
    ).mockResolvedValueOnce({
      interactions: [{ issueId: ISSUE_ID_A, isLiked: true, likesCount: 2 }],
    })
    const { IssueLikeButton } = await import("./issues/[id]/issue-like-button")
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    function W({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    }
    render(
      <W>
        <IssueLikeButton issueId={ISSUE_ID_A} />
      </W>,
    )
    await vi.waitFor(() =>
      expect(
        screen.getByRole("button", { name: /unlike/i }),
      ).toBeInTheDocument(),
    )
  })
})

describe("api route bridge", () => {
  it("exports hono handlers", async () => {
    const route = await import("./api/[[...route]]/route")
    expect(route.GET).toBeTypeOf("function")
    expect(route.POST).toBeTypeOf("function")
  })
})
