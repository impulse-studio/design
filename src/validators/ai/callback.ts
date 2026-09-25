import { z } from "zod"
import type { UIMessage } from "ai"
import type { RunContext } from "@/features/ai/types"

const id = z.string().uuid()
const workerId = z.string().min(1).max(200)
const messageSchema = z
  .object({
    id: z.string().max(200),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(z.object({ type: z.string() }).passthrough()).max(500),
  })
  .passthrough()
const baseRequest = z.object({ chatId: id, eventId: id })
const runRequest = { runId: id, triggerRunId: workerId }

export const callbackRequestSchema = z.discriminatedUnion("action", [
  baseRequest.extend({ action: z.literal("load") }).strict(),
  baseRequest
    .extend({
      action: z.literal("save"),
      ...runRequest,
      messages: z.array(messageSchema).max(500),
      state: z.unknown().optional(),
      lastEventId: z.string().max(200).optional(),
    })
    .strict(),
  baseRequest.extend({ action: z.literal("begin"), ...runRequest }).strict(),
  baseRequest
    .extend({
      action: z.literal("heartbeat"),
      ...runRequest,
      answer: z.string().max(100_000),
    })
    .strict(),
  baseRequest
    .extend({
      action: z.literal("proposal"),
      ...runRequest,
      callId: z.string().min(1).max(200),
      input: z.unknown(),
    })
    .strict(),
  baseRequest
    .extend({
      action: z.literal("complete"),
      ...runRequest,
      answer: z.string().max(100_000).optional(),
      status: z.enum(["completed", "failed", "interrupted"]),
      inputTokens: z.number().int().nonnegative().nullable(),
      outputTokens: z.number().int().nonnegative().nullable(),
    })
    .strict(),
  baseRequest
    .extend({
      action: z.literal("recover"),
      triggerRunId: workerId,
    })
    .strict(),
])

const okSchema = z.object({ ok: z.literal(true) }).strict()
const runContextSchema = z
  .object({
    doc: z.unknown(),
    revision: z.number().int().nonnegative(),
    hash: z.string(),
    selectedIds: z.array(z.string()),
    project: z.unknown().optional(),
    projectId: z.string().optional(),
    activeRoute: z.string().optional(),
  })
  .strict()
const admissionSchema = z.union([
  z.object({ waiting: z.literal(true) }).strict(),
  z.object({ interrupted: z.literal(true) }).strict(),
  z
    .object({
      context: runContextSchema,
      model: z.string(),
      provider: z.enum(["openai", "anthropic"]),
      catalogue: z.unknown(),
    })
    .strict(),
])
const proposalResponseSchema = z.union([
  z
    .object({
      status: z.literal("pending"),
      message: z.string(),
      proposalId: z.string().optional(),
    })
    .strict(),
  z.object({ error: z.string() }).strict(),
])

export const callbackResponseSchemas = {
  load: z
    .object({
      messages: z.array(messageSchema),
      state: z.unknown().optional(),
      cursors: z.object({ lastOutEventId: z.string().optional() }).strict(),
    })
    .strict(),
  save: okSchema,
  begin: admissionSchema,
  heartbeat: okSchema,
  proposal: proposalResponseSchema,
  complete: okSchema,
  recover: okSchema,
} satisfies Record<CallbackAction, z.ZodType>

type CallbackRequest = z.infer<typeof callbackRequestSchema>
export type CallbackAction = CallbackRequest["action"]
type CallbackPayloads = {
  load: Record<never, never>
  save: {
    runId: string
    triggerRunId: string
    messages: UIMessage[]
    state?: unknown
    lastEventId?: string
  }
  begin: { runId: string; triggerRunId: string }
  heartbeat: { runId: string; triggerRunId: string; answer: string }
  proposal: {
    runId: string
    triggerRunId: string
    callId: string
    input: unknown
  }
  complete: {
    runId: string
    triggerRunId: string
    answer?: string
    status: "completed" | "failed" | "interrupted"
    inputTokens: number | null
    outputTokens: number | null
  }
  recover: { triggerRunId: string }
}
export type CallbackPayload<TAction extends CallbackAction> =
  CallbackPayloads[TAction]
export type CallbackResponses = {
  load: {
    messages: UIMessage[]
    state?: unknown
    cursors: { lastOutEventId?: string }
  }
  save: { ok: true }
  begin:
    | { waiting: true }
    | { interrupted: true }
    | {
        context: RunContext
        model: string
        provider: "openai" | "anthropic"
        catalogue: unknown
      }
  heartbeat: { ok: true }
  proposal:
    | { status: "pending"; message: string; proposalId?: string }
    | { error: string }
  complete: { ok: true }
  recover: { ok: true }
}
