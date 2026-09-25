import { redirect } from "next/navigation"

import { proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"
import { confirmPayphonePayment } from "@/lib/payphone"

interface PayphoneResponsePageProps {
  searchParams: {
    id?: string
    clientTransactionId?: string
    cancelled?: string
  }
}

export default async function PayphoneResponsePage({
  searchParams,
}: PayphoneResponsePageProps) {
  const { id, clientTransactionId, cancelled } = searchParams

  if (cancelled || !id || !clientTransactionId) {
    redirect("/dashboard/billing?payment=cancelled")
  }

  const payment = await db.payment.findUnique({
    where: { clientTransactionId },
  })

  if (!payment) {
    redirect("/dashboard/billing?payment=error")
  }

  if (payment.status === "APPROVED") {
    redirect("/dashboard/billing?payment=approved")
  }

  const confirmation = await confirmPayphonePayment({
    payphoneTransactionId: id,
    clientTransactionId,
  })

  await db.payment.update({
    where: { id: payment.id },
    data: {
      payphoneTransactionId: id,
      status: confirmation.status,
      rawResponse: JSON.parse(JSON.stringify(confirmation.raw)),
    },
  })

  if (confirmation.status === "APPROVED") {
    const user = await db.user.findUnique({
      where: { id: payment.userId },
      select: { proUntil: true },
    })
    const base =
      user?.proUntil && user.proUntil.getTime() > Date.now()
        ? user.proUntil.getTime()
        : Date.now()

    await db.user.update({
      where: { id: payment.userId },
      data: {
        isPro: true,
        proUntil: new Date(base + proPlan.durationDays * 86_400_000),
      },
    })

    redirect("/dashboard/billing?payment=approved")
  }

  redirect(
    `/dashboard/billing?payment=${
      confirmation.status === "PENDING" ? "pending" : "rejected"
    }`
  )
}
