import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useQueryState } from "nuqs"
import { describe, expect, it, vi } from "vitest"
import { SearchInput } from "./search-input"

const setSearch = vi.fn()
const debounceSpy = vi.hoisted(() =>
  vi.fn((value: number) => `debounced-${value}`),
)

vi.mock("nuqs", async () => {
  const actual = await vi.importActual<typeof import("nuqs")>("nuqs")
  return {
    ...actual,
    useQueryState: vi.fn(() => ["", setSearch]),
    debounce: debounceSpy,
  }
})

describe("SearchInput", () => {
  it("updates query state on input", async () => {
    const user = userEvent.setup()
    render(<SearchInput />)
    await user.type(screen.getByPlaceholderText(/Search for features/), "foo")
    expect(setSearch).toHaveBeenCalled()
    expect(debounceSpy).toHaveBeenCalledWith(500)
  })

  it("clears search without debounce when empty", async () => {
    vi.mocked(useQueryState).mockReturnValue(["x", setSearch])
    const user = userEvent.setup()
    render(<SearchInput />)
    const input = screen.getByPlaceholderText(/Search for features/)
    await user.clear(input)
    expect(setSearch).toHaveBeenCalledWith("", {
      limitUrlUpdates: undefined,
    })
  })
})
