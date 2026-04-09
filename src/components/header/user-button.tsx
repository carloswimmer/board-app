"use client"

import { Loader2Icon, LogInIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { focusRingClass } from "@/components/styles"
import { authClient } from "@/lib/auth-client"

export function UserButton() {
  const [isSigning, setIsSigning] = useState(false)
  const { data, isPending } = authClient.useSession()
  const { user } = data || {}
  const router = useRouter()

  async function handleSignIn() {
    setIsSigning(true)
    await authClient.signIn.social({ provider: "github", callbackURL: "/" })
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return isSigning || isPending ? (
    <div
      className={twMerge(
        "size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center",
        focusRingClass,
      )}
    >
      <Loader2Icon className="size-3.5 text-navy-200 animate-spin" />
    </div>
  ) : (
    <button
      type="button"
      onClick={user ? handleSignOut : handleSignIn}
      className={twMerge(
        "size-8 rounded-full cursor-pointer",
        user
          ? "overflow-hidden"
          : "bg-navy-700 border border-navy-500 flex items-center justify-center",
        user ? "" : "hover:bg-navy-600 transition-colors duration-150",
        focusRingClass,
      )}
    >
      {user ? (
        /** biome-ignore lint/performance/noImgElement: Github already optimizes the image */
        <img src={user.image ?? ""} alt={user.name} className="size-8" />
      ) : (
        <LogInIcon className="size-3.5 text-navy-200" />
      )}
    </button>
  )
}
