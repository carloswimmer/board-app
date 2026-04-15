import { describe, expect, it } from "vitest"
import { schemaOnUpdateNow } from "./schema"

describe("db schema", () => {
  it("exports table definitions", async () => {
    const schema = await import("./schema")
    expect(schema.issues).toBeDefined()
    expect(schema.comments).toBeDefined()
    expect(schema.issueLikes).toBeDefined()
    expect(schema.users).toBeDefined()
    expect(schema.sessions).toBeDefined()
    expect(schema.accounts).toBeDefined()
    expect(schema.verifications).toBeDefined()
    expect(schema.issueStatusEnum).toBeDefined()
    expect(schema.issueNumberSeq).toBeDefined()
  })

  it("runs onUpdate helper", () => {
    expect(schemaOnUpdateNow()).toBeInstanceOf(Date)
  })

  it("exposes foreign key column resolvers", async () => {
    const s = await import("./schema")
    expect(s.fkCommentsIssueId()).toBeDefined()
    expect(s.fkSessionsUserId()).toBeDefined()
    expect(s.fkAccountsUserId()).toBeDefined()
    expect(s.fkIssueLikesIssueId()).toBeDefined()
    expect(s.fkIssueLikesUserId()).toBeDefined()
  })
})
