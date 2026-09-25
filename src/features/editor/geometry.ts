import type { AnyNode, Rect } from "@digit-ai-studio/shared"
import { findNode } from "@digit-ai-studio/shared"
import { geometryIndex } from "./geometry-index"
export { frameDimension } from "./geometry-index"
import { framesOf } from "./document"
import type { EditorState } from "./types"

export const bounds = (rects: Rect[]): Rect | null => {
  if (!rects.length) return null
  const x = Math.min(...rects.map((r) => r.x)),
    y = Math.min(...rects.map((r) => r.y))
  return {
    x,
    y,
    width: Math.max(...rects.map((r) => r.x + r.width)) - x,
    height: Math.max(...rects.map((r) => r.y + r.height)) - y,
  }
}
export const contains = (rect: Rect, point: { x: number; y: number }) =>
  point.x >= rect.x &&
  point.y >= rect.y &&
  point.x <= rect.x + rect.width &&
  point.y <= rect.y + rect.height
export const intersects = (a: Rect, b: Rect) =>
  a.x <= b.x + b.width &&
  a.x + a.width >= b.x &&
  a.y <= b.y + b.height &&
  a.y + a.height >= b.y
export const nodeRect = (state: Pick<EditorState, "doc" | "layouts">, node: AnyNode): Rect | null =>
  geometryIndex(state).byId.get(node.id)?.rect ?? null
export const hitTest = (
  state: EditorState,
  point: { x: number; y: number },
  deep = false,
  excluded: ReadonlySet<string> = new Set(),
): string | null => {
  const index = geometryIndex(state)
  for (let i = index.entries.length - 1; i >= 0; i--) {
    const entry = index.entries[i]
    if (entry.hidden || (entry.locked && state.rightTab !== "inspect") ||
      entry.path.some((node) => excluded.has(node.id)) || !entry.rect || !contains(entry.rect, point)) continue
    const frameRect = index.byId.get(entry.frame.id)?.rect
    if (!frameRect || !contains(frameRect, point)) continue
    if (deep || state.rightTab === "inspect" || entry.node.type === "frame") return entry.node.id
    const entered = state.enteredId ? entry.path.findIndex((node) => node.id === state.enteredId) : 0
    return entry.path[Math.min(Math.max(0, entered) + 1, entry.path.length - 1)].id
  }
  return null
}
export const fitViewport = (rect: Rect, width: number, height: number) => {
  const zoom = Math.max(
    0.05,
    Math.min(
      1,
      (width - 120) / Math.max(1, rect.width),
      (height - 160) / Math.max(1, rect.height)
    )
  )
  return {
    zoom,
    x: (width - rect.width * zoom) / 2 - rect.x * zoom,
    y: (height - rect.height * zoom) / 2 - rect.y * zoom,
  }
}

export const computedNumber = (
  state: EditorState,
  node: AnyNode,
  property: string
) => {
  const location = findNode(framesOf(state.doc), node.id)
  const value = location
    ? state.layouts[location.frame.id]?.computed?.[node.id]?.[property]
    : undefined
  if (!value || !/^-?[\d.]+px$/.test(value)) return undefined
  const number = parseFloat(value)
  return Number.isFinite(number) ? number : undefined
}
