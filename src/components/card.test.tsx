import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Card } from "./card"

describe("Card", () => {
  it("renders compound parts", () => {
    render(
      <Card.Root href="/issues/1">
        <Card.Header>
          <Card.Number>ISS-1</Card.Number>
          <Card.Title>Title</Card.Title>
        </Card.Header>
        <Card.Footer>f</Card.Footer>
      </Card.Root>,
    )
    expect(screen.getByText("ISS-1")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/issues/1")
  })
})
