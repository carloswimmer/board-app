import { BoardColumnSkeleton } from "./board-column-skeleton"

export default async function BoardLoading() {
  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <BoardColumnSkeleton title="Backlog" />
      <BoardColumnSkeleton title="To-do" />
      <BoardColumnSkeleton title="In progress" />
      <BoardColumnSkeleton title="Done" />
    </main>
  )
}
