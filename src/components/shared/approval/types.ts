import type { ReactNode } from "react"
import type { z } from "zod"
import type { approvalAnswerSchema } from "@/features/approval/schemas"

export type ApprovalCardStatus =
  | "pending"
  | "submitting"
  | "approved"
  | "rejected"
  | "changes-requested"
  | "answered"

export interface ApprovalCardOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ApprovalCardQuestion {
  id: string
  title: ReactNode
  description?: ReactNode
  options?: ApprovalCardOption[]
  multiple?: boolean
  autoAdvance?: boolean
  allowCustom?: boolean
  customPlaceholder?: string
}

export type ApprovalCardAnswer = z.infer<typeof approvalAnswerSchema>

export type ApprovalCardAnswers = Record<string, ApprovalCardAnswer>

export interface ApprovalCardProps {
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  questions?: ApprovalCardQuestion[]
  status?: ApprovalCardStatus
  answers?: ApprovalCardAnswers
  defaultAnswers?: ApprovalCardAnswers
  onAnswersChange?: (answers: ApprovalCardAnswers) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  onSubmit?: (answers: ApprovalCardAnswers) => void
  onApprove?: () => void
  onReject?: () => void
  onRequestChanges?: () => void
  onDismiss?: () => void
  approveLabel?: ReactNode
  submitLabel?: ReactNode
  result?: ReactNode
  className?: string
}
