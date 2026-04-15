"use client"

import type { z } from "@hono/zod-openapi"
import { useQuery } from "@tanstack/react-query"
import { ArchiveIcon, MessageCircleIcon } from "lucide-react"
import { useMemo } from "react"
import type { IssueCardSchema } from "@/api/routes/list-issues"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { LikeButton } from "@/components/like-button"
import { Section } from "@/components/section"
import { getIssueInteractions } from "@/http/get-issue-interactions"

interface BoardColumnProps {
  title: string
  issues: Array<z.infer<typeof IssueCardSchema>>
  className: string
}

type InteractionValue = {
  isLiked: boolean
  likesCount: number
}

export function BoardColumn({ title, issues, className }: BoardColumnProps) {
  const allIssueIds = issues.map((issue) => issue.id)

  const { data: interactionsData } = useQuery({
    queryKey: ["issue-likes", allIssueIds.join()],
    queryFn: () => getIssueInteractions({ issueIds: allIssueIds }),
  })

  const interactions = useMemo(() => {
    if (!interactionsData) {
      return new Map<string, InteractionValue>()
    }

    return new Map<string, InteractionValue>(
      interactionsData.interactions.map((interaction) => [
        interaction.issueId,
        { isLiked: interaction.isLiked, likesCount: interaction.likesCount },
      ]),
    )
  }, [interactionsData])

  return (
    <Section.Root className={className}>
      <Section.Header>
        <Section.Title>
          <ArchiveIcon className="size-3" />
          {title}
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
          issues.map((issue) => {
            const interaction = interactions.get(issue.id)

            return (
              <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>
                <Card.Footer>
                  <LikeButton
                    issueId={issue.id}
                    initialLikes={interaction?.likesCount ?? 0}
                    initialLiked={interaction?.isLiked ?? false}
                  />
                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-sm">{issue.comments}</span>
                  </Button>
                </Card.Footer>
              </Card.Root>
            )
          })
        )}
      </Section.Content>
    </Section.Root>
  )
}
