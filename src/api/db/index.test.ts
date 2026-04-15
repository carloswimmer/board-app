import { beforeEach, describe, expect, it, vi } from "vitest"

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv("DATABASE_URL", "postgres://u:p@localhost:5432/db")
  vi.stubEnv("BETTER_AUTH_SECRET", "0".repeat(32))
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000")
  vi.stubEnv("GITHUB_CLIENT_ID", "id")
  vi.stubEnv("GITHUB_CLIENT_SECRET", "secret")
})

vi.mock("postgres", () => ({
  default: vi.fn(() => ({
    end: vi.fn(),
  })),
}))

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn(() => ({ mockDb: true })),
}))

describe("db index", () => {
  it("creates drizzle client", async () => {
    const { db } = await import("./index")
    expect(db).toEqual({ mockDb: true })
  })
})
