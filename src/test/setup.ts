import "@testing-library/jest-dom/vitest"
import React from "react"
import { afterEach, vi } from "vitest"

Object.assign(process.env, {
  DATABASE_URL: "postgres://test:test@localhost:5432/test",
  BETTER_AUTH_SECRET: "0".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
  GITHUB_CLIENT_ID: "test-github-id",
  GITHUB_CLIENT_SECRET: "test-github-secret",
})

vi.mock("server-only", () => ({}))

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
  updateTag: vi.fn(),
}))

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode
    href: string
  }) => React.createElement("a", { href, ...props }, children),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter-mock" }),
}))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})
