import { UserSubscriptionPlan } from "types"
import { freePlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      isPro: true,
      proUntil: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // A user is PRO while the flag is set and the paid period has not expired.
  const isPro =
    user.isPro && (!user.proUntil || user.proUntil.getTime() > Date.now())

  const plan = isPro ? proPlan : freePlan

  return {
    ...plan,
    isPro,
    proUntil: user.proUntil?.getTime() ?? null,
  }
}
