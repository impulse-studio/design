import { findNode } from "@digit-ai-studio/shared"
import type { AnyNode } from "@digit-ai-studio/shared"
import type { Editor } from "./store"
import type { EditorState } from "./types"
import { framesOf } from "./document"
import { nodeRect } from "./geometry"

export const dimensionValue = (
  state: EditorState,
  node: AnyNode,
  axis: "width" | "height"
) => {
  const fixed =
    node.type === "frame"
      ? typeof node[axis] === "number"
        ? node[axis]
        : undefined
      : node.layout?.[axis]?.mode === "fixed"
        ? node.layout[axis].value
        : undefined
  return typeof fixed === "number" ? fixed : nodeRect(state, node)?.[axis]
}

export const resizeDimension = (
  editor: Editor,
  axis: "width" | "height",
  value: number
) => {
  if (!Number.isFinite(value)) return
  const state = editor.state.get(),
    other = axis === "width" ? "height" : "width"
  editor.updateSelection((node) => {
    const original = findNode(framesOf(state.doc), node.id)!.node
    const originalSize = dimensionValue(state, original, axis)
    const originalOther = dimensionValue(state, original, other)
    let size = Math.max(1, Math.min(100000, value))
    let paired: number | undefined
    if (node.lockAspectRatio && originalSize && originalOther) {
      const ratio = originalOther / originalSize
      size = Math.max(
        Math.max(1, 1 / ratio),
        Math.min(Math.min(100000, 100000 / ratio), size)
      )
      paired = Math.round(size * ratio * 10000) / 10000
    }
    if (node.type === "frame") {
      node[axis] = size
      if (paired !== undefined) node[other] = paired
      delete node.preset
    } else {
      node.layout = { ...node.layout, [axis]: { mode: "fixed", value: size } }
      if (paired !== undefined)
        node.layout[other] = { mode: "fixed", value: paired }
    }
  })
}

export const setPositioning = (
  editor: Editor,
  position: "absolute" | "flow"
) => {
  const state = editor.state.get()
  editor.updateSelection((node) => {
    if (node.type === "frame") return
    if (position === "flow") {
      node.layout = { ...node.layout, position: "flow" }
      return
    }
    if (node.layout?.position && node.layout.position !== "flow") return
    const location = findNode(framesOf(state.doc), node.id)
    const rect = nodeRect(state, node)
    const parent = location?.parent ? nodeRect(state, location.parent) : null
    node.layout = {
      ...node.layout,
      ...(node.layout?.width?.mode === "fill" && rect
        ? { width: { mode: "fixed" as const, value: rect.width } }
        : {}),
      ...(node.layout?.height?.mode === "fill" && rect
        ? { height: { mode: "fixed" as const, value: rect.height } }
        : {}),
      position: {
        x: Math.round((rect?.x ?? 0) - (parent?.x ?? 0)),
        y: Math.round((rect?.y ?? 0) - (parent?.y ?? 0)),
      },
    }
  })
}

export const positionValue = (
  state: EditorState,
  node: AnyNode,
  axis: "x" | "y"
) => {
  if (node.type === "frame") return node[axis]
  if (node.layout?.position && node.layout.position !== "flow")
    return node.layout.position[axis]
  const location = findNode(framesOf(state.doc), node.id)
  const rect = nodeRect(state, node)
  const parent = location?.parent ? nodeRect(state, location.parent) : null
  return rect && parent
    ? Math.round((rect[axis] - parent[axis]) * 100) / 100
    : undefined
}
