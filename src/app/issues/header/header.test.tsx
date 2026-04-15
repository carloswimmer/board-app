import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Header } from "./header"

vi.mock("@/components/header/description", () => ({
  Description: () => <div>Desc</div>,
}))

vi.mock("@/components/header/user-button", () => ({
  UserButton: () => <div data-testid="ub" />,
}))

describe("issues Header", () => {
  it("renders description and user button", () => {
    render(<Header />)
    expect(screen.getByText("Desc")).toBeInTheDocument()
    expect(screen.getByTestId("ub")).toBeInTheDocument()
  })
})
