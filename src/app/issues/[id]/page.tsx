import { ChevronLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { getIssue } from "@/http/get-issue"
import { IssueDetails } from "./issue-details"

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

export default async function Issue({ params }: IssueProps) {
  const { id } = await params

  return (
    <main className="max-w-[900px] mx-auto w-full flex flex-col gap-4 p-6 bg-navy-800 border-[0.5px] border-navy-500 rounded-xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-navy-200 hover:text-navy-100"
      >
        <ChevronLeftIcon className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      <IssueDetails issueId={id} />
    </main>
  )
}
