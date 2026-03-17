import Link from "next/link"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { focusRingClass } from "./styles"

interface CardRootProps extends ComponentProps<typeof Link> {}

function CardRoot({ className, ...props }: CardRootProps) {
  return (
    <Link
      className={twMerge(
        "bg-navy-700 border-[0.5px] border-navy-600 p-3 space-y-4 rounded-lg block",
        "hover:bg-navy-600/50 hover:border-navy-500 transition-colors duration-150",
        focusRingClass,
        className,
      )}
      {...props}
    ></Link>
  )
}

interface CardHeaderProps extends ComponentProps<"div"> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)} {...props}></div>
  )
}

interface CardTitleProps extends ComponentProps<"div"> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <span
      className={twMerge("text-sm font-medium", className)}
      {...props}
    ></span>
  )
}

interface CardNumberProps extends ComponentProps<"div"> {}

function CardNumber({ className, ...props }: CardNumberProps) {
  return (
    <span
      className={twMerge("text-xs text-navy-200", className)}
      {...props}
    ></span>
  )
}

interface CardFooterProps extends ComponentProps<"div"> {}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={twMerge("flex items-center gap-2", className)}
      {...props}
    ></div>
  )
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Number: CardNumber,
  Footer: CardFooter,
}
