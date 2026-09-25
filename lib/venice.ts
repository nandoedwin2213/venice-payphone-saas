import { env } from "@/env.mjs"

/**
 * Venice.ai exposes an OpenAI-compatible REST API. We talk to it with plain
 * `fetch` so no extra SDK is required; `baseURL` is the only thing that
 * differs from OpenAI.
 */
export const VENICE_BASE_URL = "https://api.venice.ai/api/v1"

function headers() {
  return {
    Authorization: `Bearer ${env.VENICE_API_KEY}`,
    "Content-Type": "application/json",
  }
}

async function veniceFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${VENICE_BASE_URL}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Venice ${path} failed (${response.status}): ${text}`)
  }

  return (await response.json()) as T
}

type ChatCompletionResponse = {
  choices: { message: { role: string; content: string } }[]
}

export async function generateText(input: {
  prompt: string
  system?: string
  model?: string
}): Promise<string> {
  const messages: { role: "system" | "user"; content: string }[] = []
  if (input.system) messages.push({ role: "system", content: input.system })
  messages.push({ role: "user", content: input.prompt })

  const data = await veniceFetch<ChatCompletionResponse>("/chat/completions", {
    model: input.model ?? env.VENICE_MODEL,
    messages,
    venice_parameters: {
      // Skip Venice's default system prompt so the model answers unfiltered.
      include_venice_system_prompt: false,
    },
  })

  return data.choices?.[0]?.message?.content ?? ""
}

type ImageGenerationResponse = {
  images: string[]
}

/** Returns a data URL (`data:image/png;base64,...`) for the generated image. */
export async function generateImage(input: {
  prompt: string
  model?: string
  width?: number
  height?: number
}): Promise<string> {
  const data = await veniceFetch<ImageGenerationResponse>("/image/generate", {
    model: input.model ?? env.VENICE_IMAGE_MODEL,
    prompt: input.prompt,
    width: input.width ?? 1024,
    height: input.height ?? 1024,
    format: "png",
    safe_mode: false,
    hide_watermark: true,
    return_binary: false,
  })

  const base64 = data.images?.[0]
  if (!base64) {
    throw new Error("Venice returned no image")
  }

  return `data:image/png;base64,${base64}`
}
