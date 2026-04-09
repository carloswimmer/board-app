import { ImageResponse } from "next/og"
import { getIssue } from "@/http/get-issue"

interface IssueIdProps {
  id: string
}

interface IssueImageProps {
  params: Promise<IssueIdProps>
}

export default async function IssueImage({ params }: IssueImageProps) {
  const { id } = await params
  const issue = await getIssue({ id })

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: "#16161d",
        padding: "80px",
      }}
    >
      <p
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: "#9397aa",
        }}
      >
        ISS-{issue.issueNumber}
      </p>
      <p
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#ecedf2",
          textAlign: "left",
          maxWidth: 1000,
        }}
      >
        {issue.title}
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
