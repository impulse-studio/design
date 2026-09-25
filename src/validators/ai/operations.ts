import { z } from "zod"
import { frameSchema, nodeSchema } from "@digit-ai-studio/shared"

const id = z.string().min(1).max(100)

export const operationSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("addFrame"), frame: frameSchema }).strict(),
  z
    .object({
      type: z.literal("insertNode"),
      parentId: id,
      slot: z.string().max(100).optional(),
      index: z.number().int().nonnegative().optional(),
      node: nodeSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("updateNode"),
      id,
      patch: z.record(z.string(), z.json()),
    })
    .strict(),
  z.object({ type: z.literal("removeNode"), id }).strict(),
  z
    .object({
      type: z.literal("moveNode"),
      id,
      parentId: id,
      slot: z.string().max(100).optional(),
      index: z.number().int().nonnegative().optional(),
    })
    .strict(),
])

export const proposalInputSchema = z
  .object({
    summary: z.string().trim().min(1).max(4000),
    operations: z.array(operationSchema).min(1).max(100),
  })
  .strict()

export type MockupOperation = z.infer<typeof operationSchema>

export type ProposalInput = z.infer<typeof proposalInputSchema>
