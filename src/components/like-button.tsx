import { ThumbsUpIcon } from "lucide-react"
import type { ComponentProps, MouseEvent } from "react"
import { useLikeMutation } from "@/hook/useLikeMutation"
import { Button } from "./button"

interface LikeButtonProps extends ComponentProps<"button"> {
  issueId: string
  initialLikes: number
  initialLiked?: boolean
}

export function LikeButton({
  issueId,
  initialLikes,
  initialLiked = false,
  ...props
}: LikeButtonProps) {
  const liked = initialLiked

  const { mutate: onToggleLike, isPending } = useLikeMutation(issueId)

  function handleToggleLike(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    onToggleLike()
  }

  return (
    <Button
      {...props}
      data-liked={liked}
      className="data-[liked=true]:bg-indigo-600 data-[liked=true]:hover:bg-indigo-500 data-[liked=true]:text-white"
      aria-label={liked ? "Unlike" : "Like"}
      disabled={isPending}
      onClick={handleToggleLike}
    >
      <ThumbsUpIcon className="size-3" />
      <span className="text-sm">{initialLikes}</span>
    </Button>
  )
}
