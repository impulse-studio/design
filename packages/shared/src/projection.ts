import type {
  BoxStyle,
  ComponentNode,
  FrameNode,
  Json,
  Node,
  SelfLayout,
} from "./doc"

export type ResolvedComponent = {
  props: Record<string, Json>
  text: string | undefined
  layout: SelfLayout | undefined
  style: BoxStyle | undefined
}

export const resolveComponent = (
  node: ComponentNode
): ResolvedComponent => {
  const variantLayout = node.localVariant?.layout
  const variantStyle = node.localVariant?.style
  return {
    props: { ...(node.localVariant?.props ?? {}), ...(node.props ?? {}) },
    text: node.text ?? node.localVariant?.text,
    layout:
      variantLayout || node.layout
        ? { ...variantLayout, ...node.layout }
        : undefined,
    style:
      variantStyle || node.style ? { ...variantStyle, ...node.style } : undefined,
  }
}

export const visibleNodes = <TNode extends FrameNode | Node>(
  nodes: TNode[]
): TNode[] => nodes.filter((node) => !node.hidden)

export const projectedElementAttributes = (
  node: Extract<Node, { type: "element" }>
) =>
  Object.fromEntries(
    Object.entries(node.attributes ?? {}).filter(
      ([name]) =>
        !/^on/i.test(name) &&
        name.toLowerCase() !== "srcdoc" &&
        name.toLowerCase() !== "style"
    )
  )

export const projectedElementStyles = (
  node: Extract<Node, { type: "element" }>
): string[] => [
  node.inlineStyle ?? "",
  typeof node.attributes?.style === "string" ? node.attributes.style : "",
]
