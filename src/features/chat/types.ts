import { z } from "zod"

export const effortSchema = z.enum(["low", "medium", "high", "xhigh"])
export type ChatEffort = z.infer<typeof effortSchema>
export const scenarioSchema = z.enum([
  "create",
  "selection",
  "illustration",
  "error",
])
export type ChatScenario = z.infer<typeof scenarioSchema>

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().nonnegative(),
  type: z.string(),
  blobUrl: z.string().optional(),
})
export type ChatAttachment = z.infer<typeof attachmentSchema>
export const contextSchema = z.object({ id: z.string(), label: z.string() })
export type ChatContextItem = z.infer<typeof contextSchema>
export const answerSchema = z.object({
  selected: z.array(z.string()),
  custom: z.string(),
})
export type ChatAnswer = z.infer<typeof answerSchema>
export type ChatAnswers = Partial<Record<string, ChatAnswer>>
export const questionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  required: z.boolean(),
  multiple: z.boolean(),
  choices: z.array(z.object({ value: z.string(), label: z.string() })),
})
export type ChatQuestion = z.infer<typeof questionSchema>

export const blockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("thinking"),
    active: z.boolean(),
    lines: z.array(z.string()),
  }),
  z.object({
    type: z.literal("questions"),
    questions: z.array(questionSchema),
    answers: z.record(z.string(), answerSchema.optional()),
    current: z.string(),
    submitted: z.boolean(),
  }),
  z.object({
    type: z.literal("approval"),
    description: z.string(),
    status: z.enum(["pending", "approved", "rejected", "changes-requested"]),
  }),
  z.object({
    type: z.literal("tool"),
    target: z.string(),
    status: z.enum(["pending", "running", "complete", "denied", "error"]),
  }),
  z.object({
    type: z.literal("activity"),
    active: z.boolean(),
    steps: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        status: z.enum(["pending", "active", "complete"]),
      })
    ),
  }),
  z.object({
    type: z.literal("tasks"),
    tasks: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        status: z.enum(["pending", "in-progress", "completed"]),
      })
    ),
  }),
  z.object({
    type: z.literal("attachments"),
    items: z.array(attachmentSchema),
  }),
  z.object({
    type: z.literal("sources"),
    text: z.string(),
    refs: z.array(
      z.object({
        n: z.number(),
        label: z.string(),
        host: z.string(),
        url: z.string().url(),
      })
    ),
  }),
  z.object({
    type: z.literal("diff"),
    file: z.string(),
    rows: z.array(
      z.object({
        old: z.number().nullable(),
        cur: z.number().nullable(),
        type: z.enum(["ctx", "add", "del"]),
        text: z.string(),
      })
    ),
  }),
  z.object({
    type: z.literal("image"),
    status: z.enum(["queued", "generating", "refining", "complete", "error"]),
    prompt: z.string(),
  }),
])
export type ChatBlock = z.infer<typeof blockSchema>
export const requestSchema = z.object({
  text: z.string(),
  model: z.string(),
  effort: effortSchema,
  context: z.array(contextSchema),
  attachments: z.array(attachmentSchema),
  scenario: scenarioSchema,
})
export type ChatRequest = z.infer<typeof requestSchema>
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  text: z.string(),
  blocks: z.array(blockSchema).optional(),
  status: z
    .enum([
      "thinking",
      "waiting",
      "working",
      "streaming",
      "complete",
      "stopped",
      "error",
    ])
    .optional(),
  request: requestSchema.optional(),
  attempt: z.number().optional(),
  feedback: z.enum(["up", "down"]).nullable().optional(),
})
export type ChatMessage = z.infer<typeof messageSchema>
export type ChatRun = {
  id: string
  phase:
    "thinking" | "questions" | "approval" | "tool" | "working" | "streaming"
  step: number
  request: ChatRequest
  attempt: number
  answerSummary: string
}
export type ChatDraft = { text: string; attachments: ChatAttachment[] }
export type ChatState = {
  ready: boolean
  demo: boolean
  model: string
  effort: ChatEffort
  drafts: { disconnected: ChatDraft; demo: ChatDraft }
  messages: ChatMessage[]
  run: ChatRun | null
  ignoredContext: string[]
  focusRequest: number
  notice: string | null
}
export type ChatCallbacks = {
  onAnswer?: (messageId: string, answers: ChatAnswers, current: string) => void
  onSubmitAnswers?: (messageId: string) => void
  onApprove?: (messageId: string) => void
  onReject?: (messageId: string) => void
  onRequestChanges?: (messageId: string) => void
  onToolDecision?: (messageId: string, approved: boolean) => void
  onRetry?: (messageId: string) => void
  onFeedback?: (messageId: string, feedback: "up" | "down" | null) => void
}
