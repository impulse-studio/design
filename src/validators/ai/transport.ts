import { z } from "zod"

export const transportInputSchema = z.object({
  kind: z.literal("message"),
  payload: z.object({
    chatId: z.string(),
    trigger: z.literal("submit-message"),
    runId: z.string().uuid(),
    message: z.object({
      id: z.string(),
      role: z.literal("user"),
      parts: z
        .array(z.object({ type: z.literal("text"), text: z.string() }).strict())
        .length(1),
    }),
  }),
})

export const transportResponseSchema = z
  .object({
    seq: z.number().optional(),
    pendingVersion: z.boolean().optional(),
  })
  .passthrough()
