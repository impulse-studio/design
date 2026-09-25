import { z } from "zod"
import {
  childLists,
  findNode,
  frameSchema,
  nodeSchema,
  validateDocument,
  walk,
} from "@digit-ai-studio/shared"
import type {
  AnyNode,
  LibraryManifest,
  MockupDoc,
  Node,
} from "@digit-ai-studio/shared"

const id = z.string().min(1).max(100)
export const operationSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("addFrame"), frame: frameSchema }).strict(),
  z
    .object({
      type: z.literal("insertNode"),
      parentId: id,
      slot: z.string().max(100).optional(),
      index: z.number().int().nonnegative().optional(),
      node: nodeSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("updateNode"),
      id,
      patch: z.record(z.string(), z.json()),
    })
    .strict(),
  z.object({ type: z.literal("removeNode"), id }).strict(),
  z
    .object({
      type: z.literal("moveNode"),
      id,
      parentId: id,
      slot: z.string().max(100).optional(),
      index: z.number().int().nonnegative().optional(),
    })
    .strict(),
])
export const proposalInputSchema = z
  .object({
    summary: z.string().trim().min(1).max(4000),
    operations: z.array(operationSchema).min(1).max(100),
  })
  .strict()
export type MockupOperation = z.infer<typeof operationSchema>
export type ProposalInput = z.infer<typeof proposalInputSchema>

/** Stable across PostgreSQL JSONB key ordering and browser serialization. */
export const canonicalDocument = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonicalDocument).join(",")}]`
  if (value !== null && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, v]) => `${JSON.stringify(key)}:${canonicalDocument(v)}`)
      .join(",")}}`
  return JSON.stringify(value)
}

export const applyOperations = (
  source: MockupDoc,
  input: unknown,
  manifest: LibraryManifest
): MockupDoc => {
  // Check raw keys before schema parsing, which intentionally drops __proto__.
  const pending: unknown[] = [input]
  let visited = 0
  while (pending.length) {
    const item = pending.pop()
    if (++visited > 100_000) throw new Error("Proposition trop complexe.")
    if (item && typeof item === "object")
      for (const [key, value] of Object.entries(item)) {
        if (["__proto__", "prototype", "constructor"].includes(key))
          throw new Error(
            "Utilisez une opération dédiée pour modifier l’arbre."
          )
        if (value && typeof value === "object") pending.push(value)
      }
  }
  const { operations } = proposalInputSchema.parse(input)
  const doc = structuredClone(source)
  const frames = doc.pages[0].frames
  const locate = (nodeId: string) => {
    const location = findNode(frames, nodeId)
    if (!location) throw new Error(`Calque introuvable : ${nodeId}`)
    if (location.path.some((node) => node.locked))
      throw new Error("Un calque est verrouillé.")
    return location
  }
  const ensureUnlockedSubtree = (node: AnyNode) =>
    walk(node, (child) => {
      if (child.locked)
        throw new Error("La modification affecte un calque verrouillé.")
    })
  const targetList = (parentId: string, slot?: string): Node[] => {
    const parent = locate(parentId).node
    if (parent.type === "box" || parent.type === "frame") {
      if (slot && slot !== "children")
        throw new Error("Ce calque ne possède pas de slot.")
      return parent.children
    }
    if (parent.type !== "component" && parent.type !== "template")
      throw new Error("Ce calque ne peut pas contenir d’enfants.")
    const name =
      parent.type === "component" ? parent.component : parent.template
    const entry = [...manifest.components, ...manifest.templates].find(
      (item) => item.name === name
    )
    const key = slot ?? "default"
    if (!entry?.slots.includes(key)) throw new Error("Slot inconnu.")
    parent.slots ??= {}
    return (parent.slots[key] ??= [])
  }
  const remove = (nodeId: string) => {
    const location = locate(nodeId)
    ensureUnlockedSubtree(location.node)
    const list = location.parent
      ? childLists(location.parent).find((entry) =>
          entry.nodes.some((node) => node.id === nodeId)
        )?.nodes
      : frames
    if (!list) throw new Error("Parent introuvable.")
    list.splice(
      list.findIndex((node) => node.id === nodeId),
      1
    )
    return location.node
  }
  for (const operation of operations) {
    switch (operation.type) {
      case "addFrame":
        ensureUnlockedSubtree(operation.frame)
        frames.push(structuredClone(operation.frame))
        break
      case "insertNode": {
        ensureUnlockedSubtree(operation.node)
        const list = targetList(operation.parentId, operation.slot)
        if ((operation.index ?? list.length) > list.length)
          throw new Error("Position d’insertion invalide.")
        list.splice(
          operation.index ?? list.length,
          0,
          structuredClone(operation.node)
        )
        break
      }
      case "updateNode": {
        const node = locate(operation.id).node
        ensureUnlockedSubtree(node)
        const forbidden = [
          "id",
          "type",
          "children",
          "slots",
          "locked",
          "__proto__",
          "constructor",
          "prototype",
        ]
        if (Object.keys(operation.patch).some((key) => forbidden.includes(key)))
          throw new Error(
            "Utilisez une opération dédiée pour modifier l’arbre."
          )
        Object.assign(node, structuredClone(operation.patch))
        break
      }
      case "removeNode":
        remove(operation.id)
        break
      case "moveNode": {
        const target = locate(operation.parentId)
        if (target.path.some((node) => node.id === operation.id))
          throw new Error("Déplacement circulaire interdit.")
        const node = locate(operation.id).node
        if (node.type === "frame")
          throw new Error("Déplacez une frame en modifiant ses coordonnées.")
        const list = targetList(operation.parentId, operation.slot)
        remove(operation.id)
        if ((operation.index ?? list.length) > list.length)
          throw new Error("Position d’insertion invalide.")
        list.splice(operation.index ?? list.length, 0, node)
        break
      }
    }
    // Validate each step: subsequent operations cannot exploit duplicate identifiers.
    validateDocument(doc, manifest)
  }
  return validateDocument(doc, manifest)
}
