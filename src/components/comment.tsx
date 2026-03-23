import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { focusRingClass } from "./styles"

interface CommentRootProps extends ComponentProps<"div"> {}

function CommentRoot({ className, ...props }: CommentRootProps) {
  return (
    <div
      className={twMerge("flex items-start gap-2", focusRingClass, className)}
      {...props}
    ></div>
  )
}

interface CommentAvatarProps extends ComponentProps<"img"> {}

function CommentAvatar({ className, alt, ...props }: CommentAvatarProps) {
  return (
    // biome-ignore lint/performance/noImgElement: Github image is already optimized
    <img
      className={twMerge("size-8 rounded-full mt-0.5", className)}
      alt={alt}
      {...props}
    ></img>
  )
}

interface CommentContentProps extends ComponentProps<"div"> {}

function CommentContent({ className, ...props }: CommentContentProps) {
  return (
    <span
      className={twMerge(
        "flex-1 px-3 py-2.5 rounded-lg bg bg-navy-700 border-[0.5px] border-navy-600 flex flex-col gap-1",
        className,
      )}
      {...props}
    ></span>
  )
}

interface CommentHeaderProps extends ComponentProps<"div"> {}

function CommentHeader({ className, ...props }: CommentHeaderProps) {
  return (
    <div
      className={twMerge("flex items-baseline gap-1", className)}
      {...props}
    ></div>
  )
}

interface CommentAuthorProps extends ComponentProps<"span"> {}

function CommentAuthor({ className, ...props }: CommentAuthorProps) {
  return (
    <span
      className={twMerge("text-sm font-medium", className)}
      {...props}
    ></span>
  )
}

interface CommentTimeProps extends ComponentProps<"span"> {}

function CommentTime({ className, ...props }: CommentTimeProps) {
  return (
    <span
      className={twMerge("text-xs text-navy-200", className)}
      {...props}
    ></span>
  )
}

interface CommentTextProps extends ComponentProps<"p"> {}

function CommentText({ className, ...props }: CommentTextProps) {
  return (
    <p
      className={twMerge("text-sm leading-relaxed text-navy-100", className)}
      {...props}
    ></p>
  )
}

export const Comment = {
  Root: CommentRoot,
  Avatar: CommentAvatar,
  Header: CommentHeader,
  Content: CommentContent,
  Author: CommentAuthor,
  Time: CommentTime,
  Text: CommentText,
}
