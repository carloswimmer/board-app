import { cacheLife } from "next/cache"
import { IssuesListResponseSchema } from "@/api/routes/list-issues"
import { clientEnv } from "@/client-env"

interface ListIssuesParams {
  search?: string
  sort?: "issueNumber"
  direction?: "asc" | "desc"
}

export async function listIssues({
  search,
  sort = "issueNumber",
  direction = "asc",
}: ListIssuesParams = {}) {
  "use cache"

  cacheLife("minutes")

  const url = new URL("/api/issues", clientEnv.NEXT_PUBLIC_API_URL)

  url.searchParams.set("sort", sort)
  url.searchParams.set("direction", direction)

  if (search) {
    url.searchParams.set("search", search)
  }

  const response = await fetch(url)
  const data = await response.json()

  return IssuesListResponseSchema.parse(data)
}
