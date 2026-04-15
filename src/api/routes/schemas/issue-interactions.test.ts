import { describe, expect, it } from "vitest"
import { IssueInteractionsResponseSchema } from "./issue-interactions"

describe("IssueInteractionsResponseSchema", () => {
  it("parses interactions array", () => {
    const data = {
      interactions: [
        {
          issueId: "550e8400-e29b-41d4-a716-446655440000",
          isLiked: true,
          likesCount: 3,
        },
      ],
    }
    expect(IssueInteractionsResponseSchema.parse(data)).toEqual(data)
  })

  it("rejects invalid uuid", () => {
    expect(() =>
      IssueInteractionsResponseSchema.parse({
        interactions: [{ issueId: "nope", isLiked: false, likesCount: 0 }],
      }),
    ).toThrow()
  })
})
