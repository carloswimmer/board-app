import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ISSUE_ID_A } from "@/test/fixtures"
import { useLikeMutation } from "./useLikeMutation"

const toggleLike = vi.fn().mockResolvedValue({})

vi.mock("@/http/toggle-like", () => ({
  toggleLike: (args: { issueId: string }) => toggleLike(args),
}))

function createClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

function wrapper({ children }: { children: ReactNode }) {
  const client = createClient()
  client.setQueryData(["issue-likes", ISSUE_ID_A], {
    interactions: [
      {
        issueId: ISSUE_ID_A,
        isLiked: false,
        likesCount: 1,
      },
    ],
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe("useLikeMutation", () => {
  it("toggles like via mutation", async () => {
    const { result } = renderHook(() => useLikeMutation(ISSUE_ID_A), {
      wrapper,
    })
    result.current.mutate()
    await waitFor(() =>
      expect(toggleLike).toHaveBeenCalledWith({ issueId: ISSUE_ID_A }),
    )
  })

  it("rolls back on error", async () => {
    toggleLike.mockRejectedValueOnce(new Error("fail"))
    const { result } = renderHook(() => useLikeMutation(ISSUE_ID_A), {
      wrapper,
    })
    result.current.mutate()
    await waitFor(() => expect(toggleLike).toHaveBeenCalled())
  })

  it("invalidates queries with comma-separated issue ids in key", async () => {
    const client = createClient()
    client.setQueryData(["issue-likes", "a,b"], {
      interactions: [
        { issueId: "a", isLiked: false, likesCount: 1 },
        { issueId: "b", isLiked: false, likesCount: 2 },
      ],
    })
    function W({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      )
    }
    const { result } = renderHook(() => useLikeMutation("a"), { wrapper: W })
    toggleLike.mockResolvedValueOnce(undefined)
    result.current.mutate()
    await waitFor(() => expect(toggleLike).toHaveBeenCalled())
  })

  it("keeps cache untouched when target issue is absent", async () => {
    const client = createClient()
    client.setQueryData(["issue-likes", ISSUE_ID_A], {
      interactions: [{ issueId: "other", isLiked: false, likesCount: 5 }],
    })
    function W({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      )
    }
    const { result } = renderHook(() => useLikeMutation(ISSUE_ID_A), {
      wrapper: W,
    })
    toggleLike.mockResolvedValueOnce(undefined)
    result.current.mutate()
    await waitFor(() => expect(toggleLike).toHaveBeenCalled())
    expect(client.getQueryData(["issue-likes", ISSUE_ID_A])).toEqual({
      interactions: [{ issueId: "other", isLiked: false, likesCount: 5 }],
    })
  })

  it("builds invalidate predicate for all key shapes", async () => {
    const client = createClient()
    client.setQueryData(["issue-likes", ISSUE_ID_A], {
      interactions: [{ issueId: ISSUE_ID_A, isLiked: false, likesCount: 1 }],
    })
    const invalidateSpy = vi.spyOn(client, "invalidateQueries")
    function W({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      )
    }

    const { result } = renderHook(() => useLikeMutation(ISSUE_ID_A), {
      wrapper: W,
    })
    toggleLike.mockResolvedValueOnce(undefined)
    result.current.mutate()
    await waitFor(() => expect(invalidateSpy).toHaveBeenCalled())

    const filters = invalidateSpy.mock.calls[0]?.[0]
    expect(filters).toBeDefined()
    const predicate = filters?.predicate
    expect(predicate?.({ queryKey: ["other-key", ISSUE_ID_A] } as never)).toBe(
      false,
    )
    expect(predicate?.({ queryKey: ["issue-likes", 123] } as never)).toBe(false)
    expect(
      predicate?.({ queryKey: ["issue-likes", ISSUE_ID_A] } as never),
    ).toBe(true)
    expect(
      predicate?.({ queryKey: ["issue-likes", `x,${ISSUE_ID_A}`] } as never),
    ).toBe(true)
  })
})
