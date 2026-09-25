import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { GeneratorForm } from "@/components/generator-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "AI Generator",
  description: "Generate uncensored text and images with Venice.ai.",
}

export default async function GeneratorPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  // Paywall: only PRO users can reach the generator.
  if (!subscriptionPlan.isPro) {
    redirect("/pricing")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Generator"
        text="Uncensored text and image generation powered by Venice.ai."
      />
      <GeneratorForm />
    </DashboardShell>
  )
}
