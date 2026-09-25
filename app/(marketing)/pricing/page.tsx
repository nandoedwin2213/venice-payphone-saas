import { proPlan } from "@/config/subscriptions"
import { Icons } from "@/components/icons"
import { PayphoneButton } from "@/components/payphone-button"

export const metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Unlock the uncensored AI generator powered by Venice.ai. Pay locally
          with PayPhone.
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What&apos;s included in the PRO plan
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Uncensored AI text
              generation
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Uncensored AI image
              generation
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Unlimited Posts
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Private, no data
              retention
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Pay with PayPhone
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Premium Support
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">
              ${(proPlan.priceCents / 100).toFixed(0)}
            </h4>
            <p className="text-sm font-medium text-muted-foreground">
              {proPlan.durationDays} days of PRO access
            </p>
          </div>
          <PayphoneButton size="lg">Subscribe with PayPhone</PayphoneButton>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
          Payments are processed securely by{" "}
          <strong>PayPhone</strong>. You will be redirected to the PayPhone
          checkout and brought back once the payment is confirmed.
        </p>
      </div>
    </section>
  )
}
