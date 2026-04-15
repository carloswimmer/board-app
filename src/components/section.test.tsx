import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Section } from "./section"

describe("Section", () => {
  it("renders compound parts", () => {
    render(
      <Section.Root>
        <Section.Header>
          <Section.Title>Col</Section.Title>
          <Section.IssueCount>2</Section.IssueCount>
        </Section.Header>
        <Section.Content>c</Section.Content>
      </Section.Root>,
    )
    expect(screen.getByText("Col")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })
})
