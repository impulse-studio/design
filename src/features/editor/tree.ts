import { v4 as uuid } from "uuid"
import type { AnyNode, MockupDoc, Node } from "@digit-ai-studio/shared"
import { childLists, findNode, walk } from "@digit-ai-studio/shared"
import { framesOf } from "./document"
import { entryFor } from "./library"

export const isEditable = (doc: MockupDoc, id: string) => {
  const location = findNode(framesOf(doc), id)
  return Boolean(location && !location.path.some((node) => node.locked))
}
export const topSelected = (doc: MockupDoc, ids: string[]) =>
  ids.filter((id) => {
    const location = findNode(framesOf(doc), id)
    return (
      location &&
      !location.path.slice(0, -1).some((node) => ids.includes(node.id))
    )
  })
export const detach = (doc: MockupDoc, id: string) => {
  const location = findNode(framesOf(doc), id)
  if (!location) return
  const list = location.parent
    ? childLists(location.parent).find((entry) =>
        entry.nodes.some((node) => node.id === id)
      )?.nodes
    : framesOf(doc)
  if (list)
    list.splice(
      list.findIndex((node) => node.id === id),
      1
    )
}
export const freshClone = <T extends AnyNode>(node: T): T => {
  const copy = JSON.parse(JSON.stringify(node)) as T
  walk(copy, (child) => {
    child.id = uuid()
  })
  return copy
}
export const insertionList = (
  parent: AnyNode,
  slot?: string
): Node[] | null => {
  if (
    parent.type === "frame" ||
    parent.type === "box" ||
    parent.type === "element"
  )
    return parent.children
  if (parent.type === "component" || parent.type === "template") {
    const key = slot ?? (parent.type === "template" ? "content" : "default")
    const entry = entryFor(
      parent.type === "template" ? parent.template : parent.component
    )
    if (!entry?.slots.includes(key)) return null
    parent.slots ??= {}
    parent.slots[key] ??= []
    return parent.slots[key]
  }
  return null
}
