import type { z } from "@hono/zod-openapi"
import { ArchiveIcon, MessageCircleIcon, ThumbsUpIcon } from "lucide-react"
import type { IssueCardSchema } from "@/api/routes/list-issues"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Section } from "@/components/section"

interface BacklogProps {
  issues: Array<z.infer<typeof IssueCardSchema>>
}

export function Backlog({ issues }: BacklogProps) {
  return (
    <Section.Root>
      <Section.Header>
        <Section.Title>
          <ArchiveIcon className="size-3" />
          Backlog
        </Section.Title>

        <Section.IssueCount>{issues.length}</Section.IssueCount>
      </Section.Header>

      <Section.Content>
        {issues.map((issue) => (
          <Card.Root key={issue.id}>
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
        ))}
      </Section.Content>
    </Section.Root>
  )
}
