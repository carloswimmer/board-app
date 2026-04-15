import { describe, expect, it } from "vitest"
import { getCookiesFromHeaders } from "./get-cookies-from-headers"

describe("getCookiesFromHeaders", () => {
  it("copies cookie header when present", () => {
    const h = getCookiesFromHeaders(
      new Headers({ cookie: "session=abc" }),
    )
    expect(h.get("cookie")).toBe("session=abc")
    expect(h.get("Content-type")).toBe("application/json")
  })

  it("omits cookie when missing", () => {
    const h = getCookiesFromHeaders(new Headers())
    expect(h.get("cookie")).toBeNull()
  })
})
