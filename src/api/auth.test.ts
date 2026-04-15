import { beforeEach, describe, expect, it, vi } from "vitest"

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv("DATABASE_URL", "postgres://u:p@localhost:5432/db")
  vi.stubEnv("BETTER_AUTH_SECRET", "0".repeat(32))
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000")
  vi.stubEnv("GITHUB_CLIENT_ID", "id")
  vi.stubEnv("GITHUB_CLIENT_SECRET", "secret")
})

vi.mock("better-auth", () => ({
  betterAuth: vi.fn(() => ({
    api: { getSession: vi.fn() },
    handler: vi.fn(),
    $Infer: { Session: {} },
  })),
}))

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: vi.fn(() => ({})),
}))

vi.mock("./db", () => ({
  db: {},
}))

describe("api auth", () => {
  it("exports auth client factory result", async () => {
    const { auth } = await import("./auth")
    expect(auth).toBeDefined()
  })
})
