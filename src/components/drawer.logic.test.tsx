import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Drawer } from "./drawer"

const back = vi.hoisted(() => vi.fn())

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back, push: vi.fn(), replace: vi.fn() }),
}))

vi.mock("@radix-ui/react-dialog", () => ({
  Root: ({
    onOpenChange,
    children,
  }: {
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }) => {
    onOpenChange(true)
    return <div>{children}</div>
  },
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Overlay: ({ className }: { className: string }) => <div className={className} />,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe("Drawer logic", () => {
  it("does not navigate back when dialog stays open", () => {
    render(
      <Drawer>
        <p>Open</p>
      </Drawer>,
    )
    expect(back).not.toHaveBeenCalled()
  })
})
