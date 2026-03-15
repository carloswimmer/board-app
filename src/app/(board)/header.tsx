import { LogInIcon, SearchIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { Input } from "@/components/input"

export function Header() {
  return (
    <div className="max-w-[900px] mx-auto w-full flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">Product Roadmap</h1>
        <p className="text-sm text-navy-100">
          Follow the development progress of our entire platform.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <SearchIcon className="absolute size-4 text-navy-200 left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />

          <Input
            type="text"
            placeholder="Search for features..."
            className="w-[270px ] pl-8"
          />
        </div>

        <button
          type="button"
          className={twMerge(
            "size-8 cursor-pointer rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center",
            "hover:bg-navy-600 transition-colors duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800",
          )}
        >
          <LogInIcon className="size-3.5 text-navy-200" />
        </button>
      </div>
    </div>
  )
}
