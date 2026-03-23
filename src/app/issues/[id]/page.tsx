import { ArchiveIcon, ChevronLeftIcon, ThumbsUpIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/button"
import { getIssue } from "@/http/get-issue"
import { IssueCommentList } from "./issue-comments/issue-comment-list"

interface Params {
  id: string
}

interface IssueProps {
  params: Promise<Params>
}

export const generateMetadata = async ({
  params,
}: IssueProps): Promise<Metadata> => {
  const { id } = await params
  const issue = await getIssue({ id })

  return { title: `Issue ${issue.title}` }
}

const statusLabels = {
  backlog: "Backlog",
  todo: "To-do",
  in_progress: "In Progress",
  done: "Done",
} as const

export default async function Issue({ params }: IssueProps) {
  const { id } = await params
  const issue = await getIssue({ id }) // deduplication avoids this second call

  return (
    <main className="max-w-[900px] mx-auto w-full flex flex-col gap-4 p-6 bg-navy-800 border-[0.5px] border-navy-500 rounded-xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-navy-200 hover:text-navy-100"
      >
        <ChevronLeftIcon className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
          <ArchiveIcon className="size-3" />
          {statusLabels[issue.status]}
        </span>

        <Button>
          <ThumbsUpIcon className="size-3" />
          <span className="text-sm">12</span>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">{issue.title}</h1>
        <p className="text-navy-100 text-sm leading-relaxed">
          {issue.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold">Comments</span>

        <form action=""></form>

        <div className="mt-3">
          <IssueCommentList issueId={issue.id} />
        </div>
      </div>
    </main>
  )
}
