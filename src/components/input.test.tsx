import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("renders controlled input", async () => {
    const user = userEvent.setup()
    render(<Input placeholder="p" />)
    const el = screen.getByPlaceholderText("p")
    await user.type(el, "hi")
    expect(el).toHaveValue("hi")
  })
})
