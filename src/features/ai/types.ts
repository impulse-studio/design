import type { modelSchema } from "@/validators/ai/models"
import type { UIMessage } from "ai"
import type { z } from "zod"
import type { MockupDoc } from "@digit-ai-studio/shared"
import type { ChatMessage } from "@/validators/chat/messages"
import type { SiteDocument } from "@/validators/sites/document"
import type { ProposalInput } from "@/validators/ai/operations"

export type AiProvider = "openai" | "anthropic"
export type AiConfiguration = {
  available: boolean
  models: Array<z.infer<typeof modelSchema> & { provider: AiProvider }>
  error: string | null
}
export type AiUsage = {
  provider: string
  model: string
  inputTokens: number | null
  outputTokens: number | null
  createdAt: string
}
export type AiRunStatus =
  "queued" | "running" | "completed" | "interrupted" | "failed"
export type AiProposal = ProposalInput & {
  id: string
  runId: string
  baseRevision: number
  baseHash: string
  resultHash: string
  status: "pending" | "applied" | "rejected"
}
type AiConversation = { id: string; title: string; updatedAt: string }
export type AiSnapshot = {
  sessionStarted: boolean
  uiMessages: UIMessage[]
  lastEventId?: string
  usage: AiUsage[]
  conversations: AiConversation[]
  conversationId: string | null
  messages: ChatMessage[]
  proposals: AiProposal[]
  run: { id: string; status: AiRunStatus; error: string | null } | null
}
export type RunContext = {
  project?: SiteDocument
  projectId?: string
  activeRoute?: string
  doc: MockupDoc
  revision: number
  hash: string
  selectedIds: string[]
}
