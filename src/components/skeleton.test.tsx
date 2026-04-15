import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Skeleton } from "./skeleton"

describe("Skeleton", () => {
  it("renders pulse div", () => {
    const { container } = render(<Skeleton data-testid="sk" />)
    expect(container.querySelector('[data-testid="sk"]')).toHaveClass(
      "animate-pulse",
    )
  })
})
