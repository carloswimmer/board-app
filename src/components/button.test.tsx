import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders and handles click", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await user.click(screen.getByRole("button", { name: "Go" }))
    expect(onClick).toHaveBeenCalled()
  })

  it("defaults type to button", () => {
    render(<Button>x</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })
})
