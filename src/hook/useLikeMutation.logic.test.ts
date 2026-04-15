import { beforeEach, describe, expect, it, vi } from "vitest"

const queryClient = vi.hoisted(() => ({
  getQueriesData: vi.fn(),
  setQueriesData: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
}))

const mutationRef = vi.hoisted(
  () =>
    ({
      onMutate: undefined as undefined | (() => Promise<unknown>),
      onError: undefined as
        | undefined
        | ((error: unknown, params: unknown, context: unknown) => Promise<void>),
      onSettled: undefined as undefined | (() => void),
    }) satisfies {
      onMutate: undefined | (() => Promise<unknown>)
      onError:
        | undefined
        | ((error: unknown, params: unknown, context: unknown) => Promise<void>)
      onSettled: undefined | (() => void)
    },
)

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => queryClient,
  useMutation: (options: {
    onMutate: () => Promise<unknown>
    onError: (error: unknown, params: unknown, context: unknown) => Promise<void>
    onSettled: () => void
  }) => {
    mutationRef.onMutate = options.onMutate
    mutationRef.onError = options.onError
    mutationRef.onSettled = options.onSettled
    return { mutate: vi.fn(), isPending: false }
  },
}))

vi.mock("@/http/toggle-like", () => ({
  toggleLike: vi.fn(),
}))

describe("useLikeMutation logic", () => {
  beforeEach(() => {
    queryClient.getQueriesData.mockReset()
    queryClient.setQueriesData.mockReset()
    queryClient.setQueryData.mockReset()
    queryClient.invalidateQueries.mockReset()
  })

  it("returns undefined when setQueriesData receives empty cache", async () => {
    const { useLikeMutation } = await import("./useLikeMutation")
    useLikeMutation("issue-1")

    queryClient.getQueriesData.mockReturnValue([])
    queryClient.setQueriesData.mockImplementation(
      (_filters: unknown, updater: (old: unknown) => unknown) => {
        expect(updater(undefined)).toBeUndefined()
      },
    )

    await mutationRef.onMutate?.()
    expect(queryClient.setQueriesData).toHaveBeenCalled()
  })

  it("decrements likes count when interaction is already liked", async () => {
    const { useLikeMutation } = await import("./useLikeMutation")
    useLikeMutation("issue-1")

    queryClient.getQueriesData.mockReturnValue([])
    queryClient.setQueriesData.mockImplementation(
      (_filters: unknown, updater: (old: unknown) => unknown) => {
        const next = updater({
          interactions: [{ issueId: "issue-1", isLiked: true, likesCount: 2 }],
        })
        expect(next).toEqual({
          interactions: [{ issueId: "issue-1", isLiked: false, likesCount: 1 }],
        })
      },
    )

    await mutationRef.onMutate?.()
  })

  it("restores previous data and skips rollback when context is missing", async () => {
    const { useLikeMutation } = await import("./useLikeMutation")
    useLikeMutation("issue-1")

    await mutationRef.onError?.(new Error("fail"), undefined, {
      previousData: [[["issue-likes", "issue-1"], { interactions: [] }]],
    })
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ["issue-likes", "issue-1"],
      { interactions: [] },
    )

    queryClient.setQueryData.mockClear()
    await mutationRef.onError?.(new Error("fail"), undefined, undefined)
    expect(queryClient.setQueryData).not.toHaveBeenCalled()
  })
})
