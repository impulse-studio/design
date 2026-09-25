import type { ReactNode } from "react"

type AgentCodeLanguage =
  "bash" | "diff" | "json" | "text" | "tsx" | "typescript"
export type ToolApprovalStatus =
  | "pending"
  | "approving"
  | "approved"
  | "denied"
  | "running"
  | "complete"
  | "error"

interface ToolApprovalParameter {
  id: string
  label: ReactNode
  value: ReactNode
}

export interface ToolApprovalCodeProps {
  code: string
  language?: AgentCodeLanguage
  className?: string
}

export interface ToolApprovalProps {
  tool: ReactNode
  title?: ReactNode
  description?: ReactNode
  parameters?: ToolApprovalParameter[]
  status?: ToolApprovalStatus
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onApprove?: () => void
  onAlwaysAllow?: () => void
  onDeny?: () => void
  className?: string
}
