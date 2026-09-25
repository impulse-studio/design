import type {
  ComponentNode,
  DetachedSnapshot,
  Node,
} from "@digit-ai-studio/shared"

export const materializeDetachedComponent = (
  source: ComponentNode,
  snapshot: DetachedSnapshot,
  createId: () => string
): Node[] => {
  const materialize = (value: DetachedSnapshot, isRoot = false): Node[] => {
    if ("slot" in value) {
      const slotNodes = source.slots?.[value.slot]
      if (slotNodes?.length) return slotNodes
      const text =
        value.slot === "default"
          ? (source.text ?? source.localVariant?.text)
          : undefined
      return text === undefined
        ? []
        : [{ id: createId(), type: "text", content: text }]
    }
    if ("text" in value)
      return [{ id: createId(), type: "text", content: value.text }]
    return [
      {
        id: isRoot ? source.id : createId(),
        ...(isRoot && source.name ? { name: source.name } : {}),
        ...(isRoot && source.hidden ? { hidden: true } : {}),
        ...(isRoot && source.locked ? { locked: true } : {}),
        ...(isRoot && source.layout ? { layout: source.layout } : {}),
        ...(isRoot && source.style ? { style: source.style } : {}),
        type: "element",
        tag: value.tag,
        ...(value.className ? { className: value.className } : {}),
        ...(value.attributes && Object.keys(value.attributes).length
          ? { attributes: value.attributes }
          : {}),
        ...(value.inlineStyle ? { inlineStyle: value.inlineStyle } : {}),
        children: value.children.flatMap((child) => materialize(child)),
      },
    ]
  }

  return materialize(snapshot, true)
}
