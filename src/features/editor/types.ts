import type { MockupDoc, Rect } from "@digit-ai-studio/shared"

import type { MockupStatus } from "@/validators/mockups"

export type Tool = "move" | "frame" | "box" | "text" | "hand"
export type Viewport = { x: number; y: number; zoom: number }
export type FrameLayout = {
  rects: Partial<Record<string, Rect>>
  computed?: Record<string, Record<string, string>>
  contentWidth?: number
  contentHeight: number
}
export type Snapshot = { doc: MockupDoc; name: string; status: MockupStatus }
export type EditorState = Snapshot & {
  selectedIds: string[]
  hoveredId: string | null
  enteredId: string | null
  editingTextId: string | null
  editingVariantId: string | null
  detachRequest: { nodeId: string; frameId: string; requestId: string } | null
  viewport: Viewport
  tool: Tool
  mode: "edit" | "preview"
  tab: "components" | "layers"
  rightTab: "design" | "inspect"
  inspectorVisible: boolean
  libraryVisible: boolean
  layouts: Partial<Record<string, FrameLayout>>
  past: Snapshot[]
  future: Snapshot[]
  transaction: Snapshot | null
  transactionFuture: Snapshot[] | null
  transactionSelection: string[] | null
  notice: string | null
}
