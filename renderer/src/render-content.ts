import { h } from "vue"
import type { Component, VNode } from "vue"
import type { Node } from "@digit-ai-studio/shared"
import { LAYOUT_WRAPPER_COMPONENTS } from "@digit-ai-studio/shared"
import { components, templates } from "./registry"
import {
  autoLayoutStyle,
  boxStyle,
  color,
  length,
  selfLayoutStyle,
} from "./styles"

export const renderContent = (
  node: Node,
  parentDirection: "row" | "column" | "grid",
  recursive: Component
): VNode => {
  const children = (
    nodes: Node[] | undefined,
    direction: "row" | "column" | "grid" = "column"
  ) =>
    (nodes ?? [])
      .filter((n) => !n.hidden)
      .map((n) =>
        h(recursive, { node: n, parentDirection: direction, key: n.id })
      )
  const slots = (value: Record<string, Node[]> | undefined, text?: string) => {
    const result: Partial<Record<string, () => (VNode | string)[]>> =
      Object.fromEntries(
        Object.entries(value ?? {}).map(([name, nodes]) => [
          name,
          () => children(nodes),
        ])
      )
    if (text !== undefined && !result.default)
      result.default = () => [h("span", { "data-editor-text": node.id }, text)]
    return result
  }
  const attrs = {
    style: {
      ...selfLayoutStyle(node.layout, parentDirection),
      ...boxStyle(node.style),
    },
  }
  switch (node.type) {
    case "component": {
      const component = (components as Partial<Record<string, Component>>)[
        node.component
      ]
      if (!component) throw new Error(`Composant inconnu : ${node.component}`)
      if (LAYOUT_WRAPPER_COMPONENTS.has(node.component))
        return h(
          "div",
          { style: { display: "inline-block", ...attrs.style } },
          [h(component, node.props, slots(node.slots, node.text))]
        )
      return h(
        component,
        { ...node.props, ...attrs },
        slots(node.slots, node.text)
      )
    }
    case "template": {
      const component = (templates as Partial<Record<string, Component>>)[
        node.template
      ]
      if (!component) throw new Error(`Template inconnu : ${node.template}`)
      return h(component, { ...node.props, ...attrs }, slots(node.slots))
    }
    case "box":
      return h(
        "div",
        {
          style: {
            ...(node.autoLayout
              ? autoLayoutStyle(node.autoLayout)
              : { position: "relative" }),
            ...attrs.style,
            overflow: node.clip ? "hidden" : "visible",
          },
        },
        children(node.children, node.autoLayout?.direction ?? "column")
      )
    case "text":
      return h(
        "p",
        {
          "data-editor-text": node.id,
          class: "studio-text",
          style: {
            fontSize: length(node.fontSize ?? node.textStyle),
            color: color(node.color),
            fontWeight: node.weight,
            textAlign: node.textAlign,
            lineHeight: node.lineHeight,
            ...attrs.style,
          },
        },
        node.content
      )
    case "image":
      return h("img", {
        src: node.src,
        alt: node.name ?? "",
        style: {
          objectFit: node.fit ?? "cover",
          borderRadius: length(node.radius),
          ...attrs.style,
        },
      })
  }
}
