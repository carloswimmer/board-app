import type { Metadata } from "next"
import { getIssue } from "@/http/get-issue"

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
  const issue = await getIssue({ id })

  return <pre>{JSON.stringify(issue, null, 2)}</pre>
}
