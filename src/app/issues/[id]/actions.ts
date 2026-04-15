"use server"

import { createComment } from "@/http/create-comment"

export async function createIssueCommentAction(issueId: string, text: string) {
  await createComment({ issueId, text })
}
