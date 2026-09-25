import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { generateImage, generateText } from "@/lib/venice"
import { generateSchema } from "@/lib/validations/generate"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)
    if (!subscriptionPlan.isPro) {
      return new Response("Requires PRO plan", { status: 402 })
    }

    const json = await req.json()
    const body = generateSchema.parse(json)

    if (body.type === "image") {
      const image = await generateImage({ prompt: body.prompt })
      return new Response(JSON.stringify({ type: "image", image }))
    }

    const text = await generateText({ prompt: body.prompt })
    return new Response(JSON.stringify({ type: "text", text }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    console.error(error)
    return new Response(null, { status: 500 })
  }
}
