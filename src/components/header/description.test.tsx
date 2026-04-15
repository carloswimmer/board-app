import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Description } from "./description"

describe("Description", () => {
  it("renders title and subtitle", () => {
    render(<Description />)
    expect(
      screen.getByRole("heading", { name: "Product Roadmap" }),
    ).toBeInTheDocument()
  })
})
