import { Description } from "@/components/header/description"
import { UserButton } from "@/components/header/user-button"

export function Header() {
  return (
    <div className="max-w-[900px] mx-auto w-full flex items-center justify-between">
      <Description />

      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </div>
  )
}
