import { z } from "zod"

export const modelSchema = z.object({
  id: z.string(),
  model: z.string(),
  displayName: z.string(),
  isDefault: z.boolean().optional(),
})

export const modelsSchema = z
  .array(
    z.object({
      id: z.string().regex(/^(openai|anthropic):[^\s:]+$/),
      displayName: z.string().min(1).max(100),
    })
  )
  .max(30)
