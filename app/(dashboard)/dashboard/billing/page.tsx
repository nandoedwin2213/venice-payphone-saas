import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

const paymentMessages: Record<string, { title: string; description: string }> =
  {
    approved: {
      title: "Payment approved",
      description: "Your PRO plan is now active. Enjoy the AI generator!",
    },
    pending: {
      title: "Payment pending",
      description:
        "PayPhone is still processing your payment. Refresh this page in a few minutes.",
    },
    rejected: {
      title: "Payment rejected",
      description: "PayPhone did not approve the payment. Please try again.",
    },
    cancelled: {
      title: "Payment cancelled",
      description: "You cancelled the payment. You can retry whenever you want.",
    },
    error: {
      title: "Payment error",
      description: "We could not verify the payment. Please contact support.",
    },
  }

interface BillingPageProps {
  searchParams: { payment?: string }
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)
  const message = searchParams.payment
    ? paymentMessages[searchParams.payment]
    : undefined

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        {message ? (
          <Alert className="!pl-14">
            {searchParams.payment === "approved" ? (
              <Icons.check />
            ) : (
              <Icons.warning />
            )}
            <AlertTitle>{message.title}</AlertTitle>
            <AlertDescription>{message.description}</AlertDescription>
          </Alert>
        ) : null}
        <BillingForm subscriptionPlan={subscriptionPlan} />
      </div>
    </DashboardShell>
  )
}
