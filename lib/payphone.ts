import { PaymentStatus } from "@prisma/client"

import { env } from "@/env.mjs"
import { absoluteUrl } from "@/lib/utils"

const PAYPHONE_API = "https://pay.payphonetodoesposible.com/api"

type PrepareInput = {
  amountCents: number
  currency: string
  clientTransactionId: string
  reference: string
}

type PrepareResult = {
  paymentId: string
  redirectUrl: string
  raw: Record<string, unknown>
}

type ConfirmResult = {
  status: PaymentStatus
  raw: Record<string, unknown>
}

function headers() {
  return {
    Authorization: `Bearer ${env.PAYPHONE_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  }
}

export function mapPayphoneStatus(value: unknown): PaymentStatus {
  const status = String(value ?? "").toUpperCase()
  if (status.includes("APPROV") || status === "3") return "APPROVED"
  if (status.includes("CANCEL")) return "CANCELLED"
  if (status.includes("REJECT")) return "REJECTED"
  if (status.includes("ERROR")) return "ERROR"
  return "PENDING"
}

/**
 * Creates a PayPhone "Botón de pagos" transaction and returns the URL the
 * user must be redirected to. Amounts are expressed in cents, as PayPhone
 * expects them.
 */
export async function preparePayphonePayment(
  input: PrepareInput
): Promise<PrepareResult> {
  const response = await fetch(`${PAYPHONE_API}/button/Prepare`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      amount: input.amountCents,
      amountWithoutTax: input.amountCents,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: input.currency,
      clientTransactionId: input.clientTransactionId,
      reference: input.reference,
      storeId: env.PAYPHONE_STORE_ID,
      responseUrl: absoluteUrl("/payphone/response"),
      cancellationUrl: absoluteUrl("/payphone/response?cancelled=true"),
    }),
  })

  const raw = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >

  if (!response.ok) {
    throw new Error(
      `PayPhone Prepare failed (${response.status}): ${JSON.stringify(raw)}`
    )
  }

  const redirectUrl = raw.payWithCard ?? raw.payWithPayPhone ?? raw.url
  if (typeof redirectUrl !== "string") {
    throw new Error("PayPhone Prepare returned no redirect URL")
  }

  return {
    paymentId: String(raw.paymentId ?? ""),
    redirectUrl,
    raw,
  }
}

/**
 * Confirms a transaction after PayPhone redirects the user back. Must be
 * called server-side; the redirect alone is not proof of payment.
 */
export async function confirmPayphonePayment(input: {
  payphoneTransactionId: string
  clientTransactionId: string
}): Promise<ConfirmResult> {
  const response = await fetch(`${PAYPHONE_API}/button/V2/Confirm`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      id: Number(input.payphoneTransactionId),
      clientTxId: input.clientTransactionId,
    }),
  })

  const raw = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >

  return {
    status: response.ok
      ? mapPayphoneStatus(raw.transactionStatus ?? raw.status)
      : "ERROR",
    raw,
  }
}
