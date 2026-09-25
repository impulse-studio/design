import type { CSSProperties, ReactNode } from "react"

export type ImageGenerationStatus =
  "queued" | "generating" | "refining" | "complete" | "error"

export interface ImageGenerationProps {
  /** The completed media. Pass an img, Next Image, canvas, video, or custom preview. */
  children?: ReactNode
  status?: ImageGenerationStatus
  /** Accessible description. Defaults to a description derived from prompt. */
  label?: string
  prompt?: string
  resolution?: string
  /** CSS aspect ratio reserved before generated media is available. */
  aspectRatio?: CSSProperties["aspectRatio"]
  size?: "compact" | "fluid"
  /** Lets the active dither cluster follow fine-pointer movement. */
  interactive?: boolean
  statusText?: string
  showStatus?: boolean
  onRetry?: () => void
  className?: string
  mediaClassName?: string
  statusClassName?: string
}
