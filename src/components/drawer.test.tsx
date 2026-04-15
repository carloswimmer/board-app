import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Drawer } from "./drawer"

const back = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back, push: vi.fn(), replace: vi.fn() }),
}))

describe("Drawer", () => {
  it("renders dialog content", () => {
    render(
      <Drawer>
        <p>Inside</p>
      </Drawer>,
    )
    expect(screen.getByText("Inside")).toBeInTheDocument()
  })

  it("navigates back when overlay closes dialog", async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <p>Panel</p>
      </Drawer>,
    )
    const overlay = document.querySelector("[class*='bg-black']")
    expect(overlay).toBeTruthy()
    await user.click(overlay as Element)
    expect(back).toHaveBeenCalled()
  })
})
