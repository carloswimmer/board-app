import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { focusRingClass } from "./styles"

export interface ButtonProps extends ComponentProps<"button"> {}

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(
        "text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer",
        "hover:bg-navy-500 transition-colors duration-150",
        focusRingClass,
        className,
      )}
      {...props}
    ></button>
  )
}
