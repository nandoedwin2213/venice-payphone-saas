import * as z from "zod"

export const generateSchema = z.object({
  type: z.enum(["text", "image"]),
  prompt: z.string().min(1).max(4000),
})

export type GenerateInput = z.infer<typeof generateSchema>
