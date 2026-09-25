import { walk } from "@digit-ai-studio/shared"
import type { AnyNode, MockupDoc } from "@digit-ai-studio/shared"
import {
  insertionIssue,
  libraryEntries,
  makeLibraryNode,
} from "@/features/editor/library"
import { canonicalDocument } from "./operations"

export const aiCatalog = libraryEntries
  .filter((entry) => !insertionIssue(entry))
  .map((entry) => ({
    name: entry.name,
    props: entry.props,
    slots: entry.slots,
    example: makeLibraryNode(entry),
  }))
const componentName = (node: AnyNode) =>
  node.type === "component"
    ? node.component
    : node.type === "template"
      ? node.template
      : null
const roots = new Set(aiCatalog.map((entry) => entry.name))
const parents = new Map<string, Set<string>>()
for (const entry of aiCatalog)
  walk(entry.example, (node, parent) => {
    const name = componentName(node),
      parentName = parent && componentName(parent)
    if (name && parentName) {
      const allowedParents = parents.get(name) ?? new Set<string>()
      allowedParents.add(parentName)
      parents.set(name, allowedParents)
    }
  })
export const validateAiComposition = (source: MockupDoc, result: MockupDoc) => {
  const previous = new Map<string, string>()
  for (const frame of source.pages[0].frames)
    walk(frame, (node, parent) =>
      previous.set(node.id, canonicalDocument([parent?.id, node]))
    )
  const ancestors = new Map<string, string | null>()
  for (const frame of result.pages[0].frames)
    walk(frame, (node, parent) => {
      const name = componentName(node),
        parentName = parent ? ancestors.get(parent.id) : null
      ancestors.set(node.id, name ?? parentName ?? null)
      if (!name || roots.has(name)) return
      if (parents.has(name)) {
        if (!parentName || !parents.get(name)!.has(parentName))
          throw new Error(`Composant à composer dans son parent Digi : ${name}`)
      } else if (
        previous.get(node.id) !== canonicalDocument([parent?.id, node])
      )
        throw new Error(`Composant sans composition utilisable : ${name}`)
    })
  return result
}
