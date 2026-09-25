import { z } from "zod"

const id = z.string().min(1).max(100)
export const querySchema = z.object({
  mockupId: id,
  conversationId: id.optional(),
})
export const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("session"), conversationId: id }).strict(),
  z.object({ action: z.literal("conversation"), mockupId: id }).strict(),
  z
    .object({
      action: z.literal("send"),
      conversationId: id,
      requestId: z.string().uuid(),
      model: z.string().min(1).max(200),
      prompt: z.string().trim().min(1).max(20_000),
      docHash: z.string().regex(/^[a-f0-9]{64}$/),
      selectedIds: z.array(id).max(100),
      activeRoute: z.string().max(200).optional(),
    })
    .strict(),
  z.object({ action: z.literal("stop"), runId: id }).strict(),
  z
    .object({
      action: z.literal("prepare"),
      proposalId: id,
      docHash: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict(),
  z
    .object({
      action: z.literal("decide"),
      proposalId: id,
      decision: z.enum(["applied", "rejected"]),
    })
    .strict(),
])
export type AiAction = z.infer<typeof actionSchema>
