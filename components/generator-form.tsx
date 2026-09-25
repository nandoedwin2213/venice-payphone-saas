"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type GenerationType = "text" | "image"

type GenerationResult =
  | { type: "text"; text: string }
  | { type: "image"; image: string }

export function GeneratorForm() {
  const router = useRouter()
  const [type, setType] = React.useState<GenerationType>("text")
  const [prompt, setPrompt] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<GenerationResult | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setResult(null)

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, prompt }),
    })

    setIsLoading(false)

    if (response.status === 402) {
      router.push("/pricing")
      return
    }

    if (!response.ok) {
      return toast({
        title: "Generation failed.",
        description: "Venice.ai did not return a result. Please try again.",
        variant: "destructive",
      })
    }

    setResult(await response.json())
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
            <CardDescription>
              Describe what you want to generate. No content filters are
              applied.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex gap-2">
              {(["text", "image"] as GenerationType[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={cn(
                    buttonVariants({
                      variant: type === option ? "default" : "outline",
                      size: "sm",
                    })
                  )}
                >
                  {option === "text" ? "Text" : "Image"}
                </button>
              ))}
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="prompt">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={
                  type === "text"
                    ? "Write a short story about..."
                    : "A cinematic photo of..."
                }
                rows={5}
                maxLength={4000}
              />
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate
            </button>
          </CardFooter>
        </Card>
      </form>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.type === "text" ? (
              <p className="whitespace-pre-wrap text-sm leading-6">
                {result.text}
              </p>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.image}
                alt={prompt}
                className="mx-auto max-h-[512px] rounded-md"
              />
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
