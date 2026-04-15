import { describe, expect, it } from "vitest"
import { LikeResponseSchema } from "./issue-likes"

describe("LikeResponseSchema", () => {
  it("parses like response", () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      likes: 2,
      liked: true,
    }
    expect(LikeResponseSchema.parse(data)).toEqual(data)
  })

  it("rejects invalid id", () => {
    expect(() =>
      LikeResponseSchema.parse({ id: "x", likes: 0, liked: false }),
    ).toThrow()
  })
})
