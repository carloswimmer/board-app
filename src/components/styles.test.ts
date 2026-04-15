import { describe, expect, it } from "vitest"
import { focusRingClass } from "./styles"

describe("styles", () => {
  it("exports focus ring utility class string", () => {
    expect(focusRingClass).toContain("focus-visible:ring")
  })
})
