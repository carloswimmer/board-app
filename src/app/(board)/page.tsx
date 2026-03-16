import { ArchiveIcon, MessageCircleIcon, ThumbsUpIcon } from "lucide-react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Section } from "@/components/section"

interface SearchParams {
  q?: string
}

interface BoardProps {
  searchParams: Promise<SearchParams>
}

export default async function Board({ searchParams }: BoardProps) {
  const { q } = await searchParams
  console.log({ q })

  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <Section.Root>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Backlog
          </Section.Title>

          <Section.IssueCount>16</Section.IssueCount>
        </Section.Header>

        <Section.Content>
          <Card.Root>
            <Card.Header>
              <Card.Number>ECO-001</Card.Number>
              <Card.Title>Implement credit card</Card.Title>
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
        </Section.Content>
      </Section.Root>
    </main>
  )
}
