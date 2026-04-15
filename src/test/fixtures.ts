/** Test UUIDs (valid v4) */
export const ISSUE_ID_A = "550e8400-e29b-41d4-a716-446655440000"
export const ISSUE_ID_B = "660e8400-e29b-41d4-a716-446655440001"
export const COMMENT_ID_A = "770e8400-e29b-41d4-a716-446655440002"

export const createdAt = new Date("2025-01-01T12:00:00.000Z")

export const mockIssueRow = {
  id: ISSUE_ID_A,
  issueNumber: 1,
  title: "Test issue",
  description: "Desc",
  status: "backlog" as const,
  likes: 5,
  createdAt,
}

export const mockUser = {
  id: "880e8400-e29b-41d4-a716-446655440003",
  name: "Alice",
  email: "alice@example.com",
  image: "https://example.com/a.png",
}

export const mockSession = {
  id: "session-1",
  userId: mockUser.id,
  expiresAt: new Date(),
}
