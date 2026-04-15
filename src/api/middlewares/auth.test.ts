import { OpenAPIHono } from "@hono/zod-openapi"
import { describe, expect, it } from "vitest"
import type { AuthSession } from "../auth"
import { requireAuth } from "./auth"

type Vars = {
  user: AuthSession["user"] | null
  session: AuthSession["session"] | null
}

function buildApp(vars: Vars) {
  const app = new OpenAPIHono<{ Variables: Vars }>()
  app.use(async (c, next) => {
    c.set("user", vars.user)
    c.set("session", vars.session)
    await next()
  })
  app.use(requireAuth)
  app.get("/x", (c) => c.json({ ok: true }))
  return app
}

describe("requireAuth", () => {
  it("returns 401 when user is null", async () => {
    const app = buildApp({ user: null, session: null })
    const res = await app.request("http://localhost/x")
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe("Unauthorized")
  })

  it("returns 401 when session is null", async () => {
    const app = buildApp({
      user: {
        id: "u1",
        name: "A",
        email: "a@a.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AuthSession["user"],
      session: null,
    })
    const res = await app.request("http://localhost/x")
    expect(res.status).toBe(401)
  })

  it("calls next when user and session exist", async () => {
    const user = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "A",
      email: "a@a.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AuthSession["user"]
    const session = {
      id: "s1",
      userId: user.id,
      expiresAt: new Date(),
      token: "t",
    } as AuthSession["session"]
    const app = buildApp({ user, session })
    const res = await app.request("http://localhost/x")
    expect(res.status).toBe(200)
  })
})
