import type { AnyNode } from "@digit-ai-studio/shared"
import { findNode } from "@digit-ai-studio/shared"
import { useEditor, useEditorState } from "./context"
import { framesOf } from "./document"
import { isEditable } from "./tree"

export const commonValue = <T>(
  nodes: AnyNode[],
  get: (node: AnyNode) => T
): T | undefined => {
  if (!nodes.length) return undefined
  const value = get(nodes[0])
  return nodes.every(
    (node) => JSON.stringify(get(node)) === JSON.stringify(value)
  )
    ? value
    : undefined
}
export const useSelection = () => {
  const editor = useEditor(),
    state = useEditorState((s) => s, (a, b) => a.doc === b.doc && a.layouts === b.layouts && a.selectedIds === b.selectedIds && a.rightTab === b.rightTab && a.editingVariantId === b.editingVariantId)
  const nodes = state.selectedIds.flatMap((id) => {
    const node = findNode(framesOf(state.doc), id)?.node
    if (!node) return []
    if (
      state.editingVariantId &&
      node.type === "component" &&
      node.localVariant?.id === state.editingVariantId
    )
      return [{
        ...node,
        props: node.localVariant.props,
        text: node.localVariant.text,
        layout: node.localVariant.layout,
        style: node.localVariant.style,
      }]
    return [node]
  })
  return {
    editor,
    state,
    nodes,
    disabled:
      state.rightTab === "inspect" ||
      nodes.some((node) => !isEditable(state.doc, node.id)),
    common: <T>(get: (node: AnyNode) => T) => commonValue(nodes, get),
    apply: editor.updateSelection,
  }
}
