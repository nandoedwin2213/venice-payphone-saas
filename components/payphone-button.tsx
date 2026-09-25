"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface PayphoneButtonProps extends ButtonProps {}

export function PayphoneButton({
  className,
  variant,
  size,
  children,
  ...props
}: PayphoneButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/payphone", { method: "POST" })

    if (response.status === 401) {
      router.push("/login?from=/pricing")
      return
    }

    if (response.status === 409) {
      router.push("/dashboard/generator")
      return
    }

    if (!response.ok) {
      setIsLoading(false)
      return toast({
        title: "Something went wrong.",
        description: "We could not start the payment. Please try again.",
        variant: "destructive",
      })
    }

    const payment = await response.json()
    if (payment?.url) {
      window.location.href = payment.url
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children ?? "Subscribe with PayPhone"}
    </button>
  )
}
