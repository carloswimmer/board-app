import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ReactQueryProvider } from "./react-query"

describe("ReactQueryProvider", () => {
  it("renders children", () => {
    render(
      <ReactQueryProvider>
        <span>child</span>
      </ReactQueryProvider>,
    )
    expect(screen.getByText("child")).toBeInTheDocument()
  })
})
