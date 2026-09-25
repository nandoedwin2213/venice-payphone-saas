import Link from "next/link"

import { UserSubscriptionPlan } from "types"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PayphoneButton } from "@/components/payphone-button"

interface BillingFormProps {
  subscriptionPlan: UserSubscriptionPlan
  className?: string
}

export function BillingForm({ subscriptionPlan, className }: BillingFormProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
          plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{subscriptionPlan.description}</CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        {subscriptionPlan.isPro ? (
          <Link href="/dashboard/generator" className={cn(buttonVariants())}>
            Open AI Generator
          </Link>
        ) : (
          <PayphoneButton>Upgrade to PRO</PayphoneButton>
        )}
        {subscriptionPlan.isPro && subscriptionPlan.proUntil ? (
          <p className="rounded-full text-xs font-medium">
            Your PRO access ends on {formatDate(subscriptionPlan.proUntil)}.
          </p>
        ) : null}
      </CardFooter>
    </Card>
  )
}
