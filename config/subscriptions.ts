import { SubscriptionPlan } from "types"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 posts. Upgrade to the PRO plan to unlock the uncensored AI generator.",
  priceCents: 0,
  currency: "USD",
  durationDays: 0,
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description:
    "The PRO plan unlocks the uncensored AI generator and unlimited posts for 30 days.",
  priceCents: 1900,
  currency: "USD",
  durationDays: 30,
}
