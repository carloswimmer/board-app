import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"
import { makeSelectFromRows } from "@/test/drizzle-mocks"
import { createdAt, ISSUE_ID_A } from "@/test/fixtures"

const getSession = vi.fn().mockResolvedValue(null)
const authHandler = vi.fn(async () => new Response("ok", { status: 200 }))

vi.mock("@/api/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => getSession(...args),
    },
    handler: (...args: unknown[]) => authHandler(...args),
  },
}))

vi.mock("@/api/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    $count: vi.fn(),
  },
}))

describe("openApiDefaultHook", () => {
  it("no-ops when success", async () => {
    const { openApiDefaultHook } = await import("./index")
    const json = vi.fn()
    const res = openApiDefaultHook({ success: true }, { json } as never)
    expect(res).toBeUndefined()
    expect(json).not.toHaveBeenCalled()
  })

  it("returns validation JSON for failed parse", async () => {
    const { openApiDefaultHook } = await import("./index")
    const json = vi.fn((body: unknown, status: number) => {
      return new Response(JSON.stringify(body), { status })
    })
    const err = new ZodError([
      {
        code: "custom",
        message: "bad",
        path: ["x"],
      },
    ])
    const res = openApiDefaultHook({ success: false, error: err }, {
      json,
    } as never)
    expect(json).toHaveBeenCalled()
    expect((await res?.json()) as { error: string }).toEqual({
      error: "Validation failed",
      message: "bad",
    })
  })
})

describe("api app", () => {
  beforeEach(async () => {
    getSession.mockResolvedValue(null)
    const { db } = await import("@/api/db")
    const row = {
      id: ISSUE_ID_A,
      issueNumber: 1,
      title: "T",
      status: "backlog" as const,
      description: "d",
      likes: 0,
      createdAt,
    }
    vi.mocked(db.select).mockReturnValue(makeSelectFromRows([row]))
    vi.mocked(db.$count).mockResolvedValue(0)
  })

  it("returns 400 for invalid query params", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/issues?status=invalid")
    expect(res.status).toBe(400)
  })

  it("returns 400 for invalid create-issue JSON body", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", description: "x" }),
    })
    expect(res.status).toBe(400)
  })

  it("lists issues on GET /api/issues", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/issues")
    expect(res.status).toBe(200)
  })

  it("serves OpenAPI spec", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/openapi.json")
    expect(res.status).toBe(200)
  })

  it("serves API docs HTML", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/docs")
    expect(res.status).toBe(200)
  })

  it("handles CORS preflight", async () => {
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/issues", {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000" },
    })
    expect(res.status).toBeLessThan(500)
  })

  it("delegates auth routes to better-auth handler", async () => {
    const { default: app } = await import("./index")
    await app.request("http://localhost/api/auth/sign-in", { method: "GET" })
    expect(authHandler).toHaveBeenCalled()
  })

  it("sets user and session when getSession returns data", async () => {
    getSession.mockResolvedValue({
      user: { id: "u1", name: "N", email: "e@e.com" },
      session: { id: "s1" },
    })
    const { default: app } = await import("./index")
    const res = await app.request("http://localhost/api/issues")
    expect(res.status).toBe(200)
  })
})
