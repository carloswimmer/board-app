import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Comment } from "./comment"

describe("Comment", () => {
  it("renders compound comment layout", () => {
    render(
      <Comment.Root>
        <Comment.Avatar src="https://example.com/a.png" alt="Sam" />
        <Comment.Content>
          <Comment.Header>
            <Comment.Author>Sam</Comment.Author>
            <Comment.Time>Today</Comment.Time>
          </Comment.Header>
          <Comment.Text>Hello world</Comment.Text>
        </Comment.Content>
      </Comment.Root>,
    )
    expect(screen.getByAltText("Sam")).toBeInTheDocument()
    expect(screen.getByText("Sam")).toBeInTheDocument()
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })
})
