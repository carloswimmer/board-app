import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Header } from "./header"

vi.mock("./search-input", () => ({
  SearchInput: () => <div data-testid="search" />,
}))

vi.mock("@/components/header/description", () => ({
  Description: () => <div>Desc</div>,
}))

vi.mock("@/components/header/user-button", () => ({
  UserButton: () => <div data-testid="user" />,
}))

describe("Board Header", () => {
  it("renders sections", () => {
    render(<Header />)
    expect(screen.getByTestId("search")).toBeInTheDocument()
    expect(screen.getByTestId("user")).toBeInTheDocument()
    expect(screen.getByText("Desc")).toBeInTheDocument()
  })
})
