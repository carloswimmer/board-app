import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { focusRingClass } from "./styles"

export interface InputProps extends ComponentProps<"input"> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={twMerge(
        "bg-navy-900 border-[0.5px] border-navy-500 h-10 flex items-center placeholder-navy-200 px-3 rounded-lg text-sm",
        focusRingClass,
        className,
      )}
      {...props}
    ></input>
  )
}
