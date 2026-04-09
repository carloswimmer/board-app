import { ArchiveIcon } from "lucide-react"
import { Card } from "@/components/card"
import { Section } from "@/components/section"
import { Skeleton } from "@/components/skeleton"

export function BoardColumnSkeleton({ title }: { title: string }) {
  return (
    <Section.Root className="bg-transparent">
      <Section.Header>
        <Section.Title>
          <ArchiveIcon className="size-3" />
          {title}
        </Section.Title>
      </Section.Header>

      <Section.Content>
        {Array.from({ length: 5 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: constant array
          <Card.Root href="" key={index} className="bg-transparent border-0">
            <Card.Header>
              <Card.Number>
                <Skeleton className="h-4 w-12" />
              </Card.Number>
              <Card.Title>
                <Skeleton className="h-5 w-full" />
              </Card.Title>
            </Card.Header>
            <Card.Footer>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-16" />
            </Card.Footer>
          </Card.Root>
        ))}
      </Section.Content>
    </Section.Root>
  )
}
