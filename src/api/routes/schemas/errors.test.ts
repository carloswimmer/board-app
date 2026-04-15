import { describe, expect, it } from "vitest"
import { ErrorSchema } from "./errors"

describe("ErrorSchema", () => {
  it("parses valid error payloads", () => {
    const parsed = ErrorSchema.parse({
      error: "Bad",
      message: "Details",
    })
    expect(parsed).toEqual({ error: "Bad", message: "Details" })
  })

  it("rejects invalid payloads", () => {
    expect(() => ErrorSchema.parse({ error: 1 })).toThrow()
  })
})
