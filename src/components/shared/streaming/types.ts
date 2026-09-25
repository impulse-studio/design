import type { ReactNode } from "react"

export interface CitationItem {
  id: string
  title: ReactNode
  domain?: ReactNode
  url?: string
}
