import { childLists } from "@digit-ai-studio/shared"
import type {
  AnyNode,
  FrameNode,
  MockupDoc,
  Rect,
} from "@digit-ai-studio/shared"
import { framesOf } from "./document"
import type { EditorState } from "./types"

type GeometryState = Pick<EditorState, "doc" | "layouts">
export type GeometryEntry = {
  node: AnyNode
  frame: FrameNode
  parent: AnyNode | null
  path: AnyNode[]
  rect: Rect | null
  hidden: boolean
  locked: boolean
}
const cache = new WeakMap<
  MockupDoc,
  {
    layouts: EditorState["layouts"]
    entries: GeometryEntry[]
    byId: Map<string, GeometryEntry>
  }
>()
export const frameDimension = (
  frame: FrameNode,
  axis: "width" | "height",
  measured: number
) => {
  const min = axis === "width" ? frame.minW : frame.minH
  const max = axis === "width" ? frame.maxW : frame.maxH
  return Math.max(
    min ?? 1,
    Math.min(max ?? 100000, frame[axis] === "hug" ? measured : frame[axis])
  )
}

/** One traversal per document/layout revision, shared by picking, snapping and overlays. */
export const geometryIndex = (state: GeometryState) => {
  const previous = cache.get(state.doc)
  if (previous?.layouts === state.layouts) return previous
  const entries: GeometryEntry[] = [],
    byId = new Map<string, GeometryEntry>()
  const visit = (
    node: AnyNode,
    frame: FrameNode,
    parent: GeometryEntry | null
  ) => {
    const measured = state.layouts[frame.id]?.rects[node.id]
    const entry: GeometryEntry = {
      node,
      frame,
      parent: parent?.node ?? null,
      path: [...(parent?.path ?? []), node],
      hidden: !!(parent?.hidden || node.hidden),
      locked: !!(parent?.locked || node.locked),
      rect:
        node.type === "frame"
          ? {
              x: node.x,
              y: node.y,
              width: frameDimension(
                node,
                "width",
                state.layouts[node.id]?.contentWidth ?? 1
              ),
              height: frameDimension(
                node,
                "height",
                state.layouts[node.id]?.contentHeight ?? 900
              ),
            }
          : measured
            ? { ...measured, x: measured.x + frame.x, y: measured.y + frame.y }
            : null,
    }
    entries.push(entry)
    byId.set(node.id, entry)
    for (const list of childLists(node))
      for (const child of list.nodes) visit(child, frame, entry)
  }
  for (const frame of framesOf(state.doc)) visit(frame, frame, null)
  const result = { layouts: state.layouts, entries, byId }
  cache.set(state.doc, result)
  return result
}
