import { produce } from "immer"
import type { Draft } from "immer"
import type { AnyNode, Json, MockupDoc, Node } from "@digit-ai-studio/shared"
import { findNode, walk } from "@digit-ai-studio/shared"
import { framesOf } from "./document"
import { entryFor, localVariantsOf } from "./library"

export type LocalVariantCommand =
  | { type: "create"; nodeId: string; variantId: string }
  | { type: "assign"; nodeIds: string[]; variantId: string | null }
  | {
      type: "update"
      variantId: string
      selectedIds: string[]
      recipe: (node: Draft<AnyNode>) => void
    }

export const applyLocalVariantCommand = (
  doc: Draft<MockupDoc>,
  command: LocalVariantCommand
) => {
  if (command.type === "create") {
    const target = findNode(framesOf(doc), command.nodeId)?.node
    if (!target || target.type !== "component") return false
    const entry = entryFor(target.component)
    const names = new Set(
      localVariantsOf(doc as MockupDoc, target.component).map(
        ({ variant }) => variant.name
      )
    )
    const baseName = `${target.component.replace(/^Digi/, "")} local`
    let name = baseName
    for (let index = 2; names.has(name); index++) name = `${baseName} ${index}`
    const layout = { ...target.localVariant?.layout, ...target.layout }
    const style = { ...target.localVariant?.style, ...target.style }
    target.localVariant = {
      id: command.variantId,
      name,
      props: {
        ...(entry?.previewProps ?? {}),
        ...(target.localVariant?.props ?? {}),
        ...(target.props ?? {}),
      },
      ...((target.text ?? target.localVariant?.text) !== undefined
        ? { text: target.text ?? target.localVariant?.text }
        : {}),
      ...(Object.keys(layout).length ? { layout } : {}),
      ...(Object.keys(style).length ? { style } : {}),
    }
    target.props = {}
    target.text = undefined
    target.layout = undefined
    target.style = undefined
    return true
  }

  if (command.type === "assign") {
    const definition = command.variantId
      ? localVariantsOf(doc as MockupDoc).find(
          ({ variant }) => variant.id === command.variantId
        )
      : undefined
    for (const id of command.nodeIds) {
      const node = findNode(framesOf(doc), id)?.node
      if (!node || node.type !== "component") continue
      if (
        command.variantId &&
        (!definition || definition.component !== node.component)
      )
        continue
      if (definition) {
        node.localVariant = JSON.parse(
          JSON.stringify(definition.variant)
        ) as typeof definition.variant
      } else if (node.localVariant) {
        node.props = { ...node.localVariant.props, ...(node.props ?? {}) }
        node.text ??= node.localVariant.text
        node.layout = { ...node.localVariant.layout, ...node.layout }
        node.style = { ...node.localVariant.style, ...node.style }
        node.localVariant = undefined
      }
    }
    return true
  }

  const definitions: {
    component: string
    props: Record<string, Json>
    text?: string
    layout?: Node["layout"]
    style?: Node["style"]
  }[] = []
  for (const frame of framesOf(doc))
    walk(frame, (node) => {
      if (
        node.type === "component" &&
        node.localVariant?.id === command.variantId
      )
        definitions.push({
          component: node.component,
          props: { ...node.localVariant.props },
          text: node.localVariant.text,
          layout: node.localVariant.layout
            ? { ...node.localVariant.layout }
            : undefined,
          style: node.localVariant.style
            ? { ...node.localVariant.style }
            : undefined,
        })
    })
  const selectedComponent = command.selectedIds
    .map((id) => findNode(framesOf(doc), id)?.node)
    .find(
      (node) =>
        node?.type === "component" &&
        node.localVariant?.id === command.variantId
    )
  const component =
    selectedComponent?.type === "component"
      ? selectedComponent.component
      : undefined
  if (definitions.length === 0) return false
  const definition =
    definitions.find((item) => item.component === component) ?? definitions[0]
  const editable = {
    id: command.variantId,
    type: "component" as const,
    component: definition.component,
    props: definition.props,
    text: definition.text,
    layout: definition.layout,
    style: definition.style,
  }
  const next = produce(editable, (draft) => command.recipe(draft))
  for (const frame of framesOf(doc))
    walk(frame, (node) => {
      if (
        node.type === "component" &&
        node.localVariant?.id === command.variantId
      ) {
        node.localVariant.props = { ...next.props }
        node.localVariant.text = next.text
        node.localVariant.layout = next.layout
        node.localVariant.style = next.style
      }
    })
  return true
}
