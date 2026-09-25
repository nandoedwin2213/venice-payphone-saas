import { randomUUID } from "crypto"
import { getServerSession } from "next-auth/next"

import { proPlan } from "@/config/subscriptions"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { preparePayphonePayment } from "@/lib/payphone"
import { getUserSubscriptionPlan } from "@/lib/subscription"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)
    if (subscriptionPlan.isPro) {
      return new Response(
        JSON.stringify({ error: "You are already on the PRO plan." }),
        { status: 409 }
      )
    }

    const clientTransactionId = `PRO-${randomUUID()}`.slice(0, 50)

    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        clientTransactionId,
        amountCents: proPlan.priceCents,
        currency: proPlan.currency,
      },
    })

    const prepared = await preparePayphonePayment({
      amountCents: payment.amountCents,
      currency: payment.currency,
      clientTransactionId,
      reference: `${proPlan.name} plan - ${proPlan.durationDays} days`,
    })

    await db.payment.update({
      where: { id: payment.id },
      data: {
        payphoneTransactionId: prepared.paymentId || null,
        rawResponse: JSON.parse(JSON.stringify(prepared.raw)),
      },
    })

    return new Response(JSON.stringify({ url: prepared.redirectUrl }))
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
