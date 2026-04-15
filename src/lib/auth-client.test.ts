import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("better-auth/react", () => ({
  createAuthClient: vi.fn(() => ({ getSession: vi.fn() })),
}))

describe("auth-client", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
  })

  it("exports authClient", async () => {
    const { authClient } = await import("./auth-client")
    expect(authClient).toBeDefined()
  })
})
