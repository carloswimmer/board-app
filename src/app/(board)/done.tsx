import type { z } from "@hono/zod-openapi"
import { ArchiveIcon, MessageCircleIcon, ThumbsUpIcon } from "lucide-react"
import type { IssueCardSchema } from "@/api/routes/list-issues"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Section } from "@/components/section"

interface DoneProps {
  issues: Array<z.infer<typeof IssueCardSchema>>
}

export function Done({ issues }: DoneProps) {
  return (
    <Section.Root className="bg-done/5">
      <Section.Header>
        <Section.Title>
          <ArchiveIcon className="size-3" />
          Done
        </Section.Title>

        <Section.IssueCount>{issues.length}</Section.IssueCount>
      </Section.Header>

      <Section.Content>
        {issues.length === 0 ? (
          <div className="flex items-center justify-center h-full py-8 mb-12 text-center">
            <p className="text-sm text-navy-300">
              No issues found for this section
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
              <Card.Header>
                <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                <Card.Title>{issue.title}</Card.Title>
              </Card.Header>
              <Card.Footer>
                <Button>
                  <ThumbsUpIcon className="size-3" />
                  <span className="text-sm">12</span>
                </Button>
                <Button>
                  <MessageCircleIcon className="size-3" />
                  <span className="text-sm">6</span>
                </Button>
              </Card.Footer>
            </Card.Root>
          ))
        )}
      </Section.Content>
    </Section.Root>
  )
}
