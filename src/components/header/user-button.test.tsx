import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { UserButton } from "./user-button"

const mocks = vi.hoisted(() => ({
  signInSocial: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn(
    async (opts?: {
      fetchOptions?: { onSuccess?: () => void }
    }) => {
      opts?.fetchOptions?.onSuccess?.()
    },
  ),
  useSession: vi.fn(() => ({ data: null, isPending: false })),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    get useSession() {
      return mocks.useSession
    },
    signIn: { social: (...a: unknown[]) => mocks.signInSocial(...a) },
    signOut: (...a: unknown[]) => mocks.signOut(...a),
  },
}))

describe("UserButton", () => {
  beforeEach(() => {
    mocks.signInSocial.mockClear()
    mocks.signOut.mockClear()
    mocks.useSession.mockReturnValue({ data: null, isPending: false })
  })

  it("signs in when unauthenticated", async () => {
    const user = userEvent.setup()
    render(<UserButton />)
    await user.click(screen.getByRole("button"))
    expect(mocks.signInSocial).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/",
    })
  })

  it("signs out when authenticated", async () => {
    mocks.useSession.mockReturnValue({
      data: {
        user: {
          id: "u1",
          name: "Bob",
          image: "https://example.com/i.png",
          email: "b@b.com",
          emailVerified: true,
        },
      },
      isPending: false,
    })
    const user = userEvent.setup()
    render(<UserButton />)
    await user.click(screen.getByRole("button", { name: "Bob" }))
    expect(mocks.signOut).toHaveBeenCalled()
  })

  it("runs onSuccess after sign out", async () => {
    mocks.useSession.mockReturnValue({
      data: {
        user: {
          id: "u1",
          name: "Bob",
          image: null,
          email: "b@b.com",
          emailVerified: true,
        },
      },
      isPending: false,
    })
    const user = userEvent.setup()
    render(<UserButton />)
    await user.click(screen.getByRole("button", { name: "Bob" }))
    expect(mocks.signOut).toHaveBeenCalled()
  })
})
