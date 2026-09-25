import { findNode } from "@digit-ai-studio/shared"
import type { AutoLayout } from "@digit-ai-studio/shared"
import type { Editor } from "./store"
import { framesOf } from "./document"
import { nodeRect } from "./geometry"

export const setAutoLayout = (
  editor: Editor,
  direction: AutoLayout["direction"] | null
) => {
  const state = editor.state.get()
  editor.updateSelection((node) => {
    if (node.type !== "frame" && node.type !== "box") return
    const previous = node.autoLayout
    if (direction === null) {
      if (!previous) return
      const parentRect = nodeRect(state, node)
      for (const child of node.children) {
        const rect = nodeRect(state, child)
        if (!rect || !parentRect) continue
        child.layout = {
          ...child.layout,
          position: {
            x: Math.round(rect.x - parentRect.x),
            y: Math.round(rect.y - parentRect.y),
          },
        }
      }
      if (node.type === "frame") {
        if (node.width === "hug")
          node.width = Math.max(1, Math.round(parentRect?.width ?? 1))
        if (node.height === "hug")
          node.height = Math.max(1, Math.round(parentRect?.height ?? 1))
      } else {
        node.layout = {
          ...node.layout,
          width: {
            mode: "fixed",
            value: Math.max(1, Math.round(parentRect?.width ?? 1)),
          },
          height: {
            mode: "fixed",
            value: Math.max(1, Math.round(parentRect?.height ?? 1)),
          },
        }
      }
      delete node.autoLayout
      return
    }
    if (!previous) {
      for (const child of node.children)
        child.layout = { ...child.layout, position: "flow" }
      node.autoLayout = {
        direction,
        gap: 0,
        padding: [0, 0, 0, 0],
        align: "start",
        ...(direction === "grid" ? { gridColumns: 2 } : {}),
      }
      return
    }
    node.autoLayout = {
      ...previous,
      direction,
      wrap: direction === "row" ? previous.wrap : false,
      gap: direction === "grid" && previous.gap === "auto" ? 0 : previous.gap,
      justify:
        direction === "grid" && previous.gap === "auto"
          ? "start"
          : previous.justify,
      ...(direction === "grid"
        ? { gridColumns: previous.gridColumns ?? 2 }
        : {}),
    }
  })
}

export const addAutoLayoutToSelection = (
  editor: Editor,
  direction?: AutoLayout["direction"]
) => {
  const state = editor.state.get()
  const selected = state.selectedIds.map(
    (id) => findNode(framesOf(state.doc), id)?.node
  )
  if (!selected.length || selected.some((node) => !node)) return
  if (
    selected.length === 1 &&
    (selected[0]?.type === "frame" || selected[0]?.type === "box")
  ) {
    setAutoLayout(editor, direction ?? "column")
    return
  }
  editor.wrapSelectionInAutoLayout(direction)
}

export const parentHasAutoLayout = (editor: Editor, id: string) => {
  const location = findNode(framesOf(editor.state.get().doc), id)
  return Boolean(
    location?.parent &&
    (location.parent.type === "frame" || location.parent.type === "box") &&
    location.parent.autoLayout
  )
}

export const setAutoLayoutGap = (
  editor: Editor,
  axis: "main" | "cross",
  value: AutoLayout["gap"]
) =>
  editor.updateSelection((node) => {
    if (
      (node.type !== "frame" && node.type !== "box") ||
      !node.autoLayout
    )
      return
    if (axis === "cross") {
      if (value !== "auto") node.autoLayout.crossGap = value
      return
    }
    node.autoLayout.gap = value
    node.autoLayout.justify = value === "auto" ? "between" : "start"
  })

export const setAutoLayoutDistribution = (
  editor: Editor,
  justify: NonNullable<AutoLayout["justify"]>
) =>
  editor.updateSelection((node) => {
    if (
      (node.type === "frame" || node.type === "box") &&
      node.autoLayout?.gap === "auto"
    )
      node.autoLayout.justify = justify
  })

export const setAutoLayoutAlignment = (
  editor: Editor,
  horizontal: "start" | "center" | "end",
  vertical: "start" | "center" | "end"
) =>
  editor.updateSelection((node) => {
    if (
      (node.type !== "frame" && node.type !== "box") ||
      !node.autoLayout
    )
      return
    if (node.autoLayout.direction === "column") {
      node.autoLayout.align = horizontal
      if (node.autoLayout.gap !== "auto")
        node.autoLayout.justify = vertical
    } else {
      if (node.autoLayout.gap !== "auto")
        node.autoLayout.justify = horizontal
      node.autoLayout.align = vertical
    }
  })
