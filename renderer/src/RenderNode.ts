import { type Component, type VNode, defineComponent, h, onErrorCaptured, type PropType, ref } from "vue"

import { post } from "./bridge"
import type { Node } from "@digit-ai-studio/shared"
import { components, templates } from "./registry"
import { autoLayoutStyle, boxStyle, color, selfLayoutStyle } from "./styles"

type Direction = "row" | "column"

function renderChildren(nodes: Node[] | undefined, parentDirection: Direction): VNode[] {
  return (nodes ?? []).filter((n) => !n.hidden).map((node) => h(RenderNode, { node, parentDirection, key: node.id }))
}

function renderSlots(slots: Record<string, Node[]> | undefined, text: string | undefined) {
  const result: Record<string, () => (VNode | string)[]> = {}
  for (const [name, nodes] of Object.entries(slots ?? {})) {
    // Slot content flows like a column unless the component lays it out otherwise.
    result[name] = () => renderChildren(nodes, "column")
  }
  if (text !== undefined && !result.default) result.default = () => [text]
  return result
}

function missing(kind: string, name: string): VNode {
  return h("div", { class: "studio-missing" }, `${kind} inconnu : ${name}`)
}

function renderNode(node: Node, parentDirection: Direction): VNode {
  const attrs = { "data-node-id": node.id, style: selfLayoutStyle(node.layout, parentDirection) }

  switch (node.type) {
    case "component": {
      const comp: Component | undefined = components[node.component]
      if (!comp) return h("div", attrs, [missing("Composant", node.component)])
      return h(comp, { ...node.props, ...attrs }, renderSlots(node.slots, node.text))
    }
    case "template": {
      const comp = templates[node.template]
      if (!comp) return h("div", attrs, [missing("Template", node.template)])
      return h(comp, { ...node.props, ...attrs }, renderSlots(node.slots, undefined))
    }
    case "box":
      return h(
        "div",
        { ...attrs, style: [autoLayoutStyle(node.autoLayout), boxStyle(node.style), attrs.style] },
        renderChildren(node.children, node.autoLayout.direction),
      )
    case "text":
      return h(
        "p",
        {
          ...attrs,
          class: "studio-text",
          style: [
            {
              fontSize: node.textStyle ? `var(--${node.textStyle.token})` : undefined,
              color: color(node.color),
              fontWeight: node.weight,
            },
            attrs.style,
          ],
        },
        node.content,
      )
    case "image":
      return h("img", {
        ...attrs,
        src: node.src,
        alt: node.name ?? "",
        style: [
          { objectFit: node.fit ?? "cover", borderRadius: node.radius ? `var(--${node.radius.token})` : undefined },
          attrs.style,
        ],
      })
  }
}

// One boundary per node: a crashing component is shown in red and the rest of the frame keeps rendering.
export const RenderNode = defineComponent({
  name: "RenderNode",
  props: {
    node: { type: Object as PropType<Node>, required: true },
    parentDirection: { type: String as PropType<Direction>, default: "column" },
  },
  setup(props) {
    const error = ref<string | null>(null)
    onErrorCaptured((e) => {
      error.value = e instanceof Error ? e.message : String(e)
      post({ type: "error", nodeId: props.node.id, message: error.value })
      return false
    })
    return () =>
      error.value
        ? h("div", { class: "studio-missing", "data-node-id": props.node.id }, `Erreur : ${error.value}`)
        : renderNode(props.node, props.parentDirection)
  },
})
