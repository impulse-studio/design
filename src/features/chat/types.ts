import type {
  ChatAttachment,
  ChatAnswers,
  ChatEffort,
  ChatMessage,
  ChatRequest,
} from "@/validators/chat/messages"

export type ChatRun = {
  id: string
  phase:
    "thinking" | "questions" | "approval" | "tool" | "working" | "streaming"
  step: number
  request: ChatRequest
  attempt: number
  answerSummary: string
}
type ChatDraft = { text: string; attachments: ChatAttachment[] }
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
