import { listIssues } from "@/http/list-issues"
import { BoardColumn } from "./board-column"

interface SearchParams {
  q?: string
}

interface BoardProps {
  searchParams: Promise<SearchParams>
}

export default async function Board({ searchParams }: BoardProps) {
  const { q } = await searchParams
  const {
    backlog,
    todo,
    in_progress: inProgress,
    done,
  } = await listIssues({ search: q })

  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <BoardColumn title="Backlog" issues={backlog} className="bg-backlog/5" />
      <BoardColumn title="To-do" issues={todo} className="bg-todo/5" />
      <BoardColumn
        title="In progress"
        issues={inProgress}
        className="bg-inprogress/5"
      />
      <BoardColumn title="Done" issues={done} className="bg-done/5" />
    </main>
  )
}
