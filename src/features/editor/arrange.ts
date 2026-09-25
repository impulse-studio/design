import { childLists, findNode } from "@digit-ai-studio/shared"
import type { AnyNode } from "@digit-ai-studio/shared"
import type { Editor } from "./store"
import { framesOf } from "./document"
import { bounds, nodeRect } from "./geometry"
import { isEditable, topSelected } from "./tree"

export type Alignment =
  "left" | "center" | "right" | "top" | "middle" | "bottom"
const movable = (node: AnyNode) =>
  node.type === "frame" ||
  (node.layout?.position !== undefined && node.layout.position !== "flow")
const entries = (editor: Editor) => {
  const state = editor.state.get()
  return topSelected(state.doc, state.selectedIds).flatMap((id) => {
    const location = findNode(framesOf(state.doc), id)
    const rect = location ? nodeRect(state, location.node) : null
    return location &&
      rect &&
      movable(location.node) &&
      isEditable(state.doc, id)
      ? [{ location, rect }]
      : []
  })
}
export const canArrange = (editor: Editor) =>
  editor.state.get().rightTab === "design" &&
  entries(editor).length === editor.state.get().selectedIds.length &&
  entries(editor).length > 0 &&
  (entries(editor).length > 1 || !!entries(editor)[0].location.parent)
export const alignSelection = (
  editor: Editor,
  alignment: Alignment,
  toParent = false
) => {
  if (toParent) {
    const selected = entries(editor),
      state = editor.state.get()
    const parents = [
      ...new Set(
        selected.map((item) => item.location.parent?.id).filter((id) => !!id)
      ),
    ]
    editor.begin()
    for (const parentId of parents) {
      const group = selected.filter(
        (item) => item.location.parent?.id === parentId
      )
      const parent = nodeRect(state, group[0].location.parent!)
      const own = bounds(group.map((item) => item.rect))
      if (!parent || !own) continue
      const dx =
        alignment === "left"
          ? parent.x - own.x
          : alignment === "right"
            ? parent.x + parent.width - own.x - own.width
            : alignment === "center"
              ? parent.x + (parent.width - own.width) / 2 - own.x
              : 0
      const dy =
        alignment === "top"
          ? parent.y - own.y
          : alignment === "bottom"
            ? parent.y + parent.height - own.y - own.height
            : alignment === "middle"
              ? parent.y + (parent.height - own.height) / 2 - own.y
              : 0
      editor.updateNodes(
        group.map((item) => item.location.node.id),
        (node) => {
          if (
            node.type !== "frame" &&
            node.layout?.position &&
            node.layout.position !== "flow"
          ) {
            node.layout.position.x += Math.round(dx)
            node.layout.position.y += Math.round(dy)
          }
        }
      )
    }
    editor.commit()
    return
  }
  const items = entries(editor),
    state = editor.state.get()
  const reference = items.length === 1 ? items[0].location.parent : null
  const area = reference
    ? nodeRect(state, reference)
    : items.length > 1
      ? bounds(items.map((item) => item.rect))
      : null
  if (!area) return
  editor.updateNodes(
    items.map((item) => item.location.node.id),
    (node) => {
      const { rect } = items.find((item) => item.location.node.id === node.id)!
      const x =
        alignment === "left"
          ? area.x
          : alignment === "center"
            ? area.x + (area.width - rect.width) / 2
            : alignment === "right"
              ? area.x + area.width - rect.width
              : rect.x
      const y =
        alignment === "top"
          ? area.y
          : alignment === "middle"
            ? area.y + (area.height - rect.height) / 2
            : alignment === "bottom"
              ? area.y + area.height - rect.height
              : rect.y
      if (node.type === "frame") {
        node.x = Math.round(x)
        node.y = Math.round(y)
      } else if (node.layout?.position && node.layout.position !== "flow") {
        node.layout.position.x += Math.round(x - rect.x)
        node.layout.position.y += Math.round(y - rect.y)
      }
    }
  )
}
export const distributeSelection = (editor: Editor, axis: "x" | "y") => {
  const items = entries(editor).sort((a, b) => a.rect[axis] - b.rect[axis])
  if (items.length < 3) return
  const size = axis === "x" ? "width" : "height",
    first = items[0],
    last = items.at(-1)!
  const gap =
    (last.rect[axis] +
      last.rect[size] -
      first.rect[axis] -
      items.reduce((sum, item) => sum + item.rect[size], 0)) /
    (items.length - 1)
  let cursor = first.rect[axis]
  editor.begin()
  for (const item of items) {
    const value = cursor
    editor.updateNodes([item.location.node.id], (node) => {
      if (node.type === "frame") node[axis] = Math.round(value)
      else if (node.layout?.position && node.layout.position !== "flow")
        node.layout.position[axis] += Math.round(value - item.rect[axis])
    })
    cursor += item.rect[size] + gap
  }
  editor.commit()
}
export const orderSelection = (
  editor: Editor,
  order: "front" | "back" | "forward" | "backward"
) => {
  const ids = topSelected(
    editor.state.get().doc,
    editor.state.get().selectedIds
  )
  editor.change((doc) => {
    for (const id of order === "back" || order === "forward"
      ? [...ids].reverse()
      : ids) {
      const location = findNode(framesOf(doc), id)
      if (!location || !isEditable(doc, id)) continue
      const list: AnyNode[] = location.parent
        ? childLists(location.parent).find((item) =>
            item.nodes.some((node) => node.id === id)
          )!.nodes
        : framesOf(doc)
      const index = list.findIndex((node) => node.id === id),
        to =
          order === "front"
            ? list.length - 1
            : order === "back"
              ? 0
              : order === "forward"
                ? Math.min(list.length - 1, index + 1)
                : Math.max(0, index - 1)
      const [node] = list.splice(index, 1)
      list.splice(to, 0, node)
    }
  })
}
