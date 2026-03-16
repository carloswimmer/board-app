import { listIssues } from "@/http/list-issues"
import { Backlog } from "./backlog"
import { Done } from "./done"
import { InProgress } from "./in-progress"
import { Todo } from "./todo"

interface SearchParams {
  q?: string
}

interface BoardProps {
  searchParams: Promise<SearchParams>
}

export default async function Board({ searchParams }: BoardProps) {
  const { q } = await searchParams
  const { backlog, todo, in_progress: inProgress, done } = await listIssues()

  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <Backlog issues={backlog} />
      <Todo issues={todo} />
      <InProgress issues={inProgress} />
      <Done issues={done} />
    </main>
  )
}
