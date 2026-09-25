import { z } from "zod"

export const createPromptSchema = (allowEmpty: boolean) =>
  z.object({
    text: allowEmpty
      ? z.string().trim()
      : z.string().trim().min(1, "Saisissez un message."),
    model: z.string().optional(),
  })

export type PromptValues = z.input<ReturnType<typeof createPromptSchema>>
