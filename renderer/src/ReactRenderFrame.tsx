import { createElement } from "react"
import type { CSSProperties, ReactNode } from "react"
import type {
  FrameNode,
  Node,
} from "@digit-ai-studio/shared"
import {
  autoLayoutStyle,
  boxStyle,
  color,
  length,
  selfLayoutStyle,
  projectedElementAttributes,
  projectedElementStyles,
  resolveComponent,
  visibleNodes,
} from "@digit-ai-studio/shared"
import { DigitComponentView } from "@digit-ai-studio/digicomponents-react"

const camelCase = (name: string) =>
  name.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
const reactProperty = (name: string) => {
  if (name === "class") return "className"
  if (name === "for") return "htmlFor"
  if (name === "tabindex") return "tabIndex"
  if (name === "readonly") return "readOnly"
  if (name === "contenteditable") return "contentEditable"
  if (/^(?:data-|aria-)/.test(name)) return name
  return camelCase(name)
}
const cssProperties = (styleText: string): CSSProperties => {
  const result: Record<string, string> = {}
  for (const declaration of styleText.split(";")) {
    const separator = declaration.indexOf(":")
    if (separator < 1) continue
    const key = declaration.slice(0, separator).trim()
    const value = declaration.slice(separator + 1).trim()
    if (key && value) result[key.startsWith("--") ? key : camelCase(key)] = value
  }
  return result
}
const mergeStyles = (...styles: (CSSProperties | undefined)[]) =>
  Object.assign({}, ...styles.filter(Boolean)) as CSSProperties

export function ReactRenderFrame({
  frame,
  mode,
}: {
  frame: FrameNode
  mode: "edit" | "preview"
}) {
  const renderNode = (
    node: Node,
    direction: "row" | "column" | "grid"
  ): ReactNode => {
    const renderChildren = (
      children: Node[],
      childDirection: "row" | "column" | "grid" = "column"
    ) =>
      visibleNodes(children)
        .map((child) => renderNode(child, childDirection))
    const wrap = (content: ReactNode, style?: CSSProperties) =>
      createElement(
        "div",
        {
          key: node.id,
          "data-editor-node": node.id,
          style: { display: "contents", ...style },
        },
        content
      )
    const resolved = node.type === "component" ? resolveComponent(node) : null
    const styles = mergeStyles(
      selfLayoutStyle(resolved?.layout ?? node.layout, direction),
      boxStyle(resolved?.style ?? node.style)
    )
    if (node.type === "component") {
      return createElement(DigitComponentView, {
        key: node.id,
        component: node.component,
        props: resolved!.props,
        nodeId: node.id,
        text: resolved!.text,
        slots: Object.fromEntries(
          Object.entries(node.slots ?? {}).map(([slot, children]) => [
            slot,
            renderChildren(children, direction),
          ])
        ),
        style: styles,
      })
    }
    if (node.type === "template")
      return wrap(
        createElement("div", { className: "digit-event-layout" }, renderChildren(Object.values(node.slots ?? {}).flat())),
        styles
      )
    if (node.type === "element") {
      const attributes: Record<string, unknown> = {}
      const booleanAttributes = new Set([
        "allowfullscreen", "async", "autofocus", "autoplay", "checked",
        "controls", "default", "defer", "disabled", "formnovalidate",
        "hidden", "ismap", "itemscope", "loop", "multiple", "muted",
        "nomodule", "novalidate", "open", "playsinline", "readonly",
        "required", "reversed", "selected",
      ])
      for (const [key, value] of Object.entries(projectedElementAttributes(node)))
        attributes[reactProperty(key)] =
          booleanAttributes.has(key.toLowerCase()) && value !== false
            ? true
            : value
      attributes.className = [node.className, attributes.className]
        .filter((value) => typeof value === "string" && value)
        .join(" ")
      attributes.style = mergeStyles(
        ...projectedElementStyles(node).map(cssProperties),
        styles
      )
      const content = node.children.length
        ? renderChildren(node.children)
        : undefined
      return wrap(
        createElement(node.tag, { ...attributes, key: node.id }, ...(content ?? [])),
        undefined
      )
    }
    if (node.type === "box")
      return wrap(
        createElement(
          "div",
          {
            style: mergeStyles(
              node.autoLayout
                ? (autoLayoutStyle(node.autoLayout) as CSSProperties)
                : { position: "relative" },
              styles,
              { overflow: node.clip ? "hidden" : "visible" }
            ),
          },
          ...renderChildren(node.children, node.autoLayout?.direction ?? "column")
        )
      )
    if (node.type === "text")
      return wrap(
        createElement(
          "p",
          {
            className: "studio-text",
            "data-editor-text": node.id,
            style: {
              fontSize: length(node.fontSize ?? node.textStyle),
              color: color(node.color),
              fontWeight: node.weight,
              textAlign: node.textAlign,
              lineHeight: node.lineHeight,
              ...styles,
            },
          },
          node.content
        )
      )
    return wrap(
      createElement("img", {
        src: node.src,
        alt: node.name ?? "",
        style: {
          objectFit: node.fit ?? "cover",
          borderRadius: length(node.radius),
          ...styles,
        },
      })
    )
  }

  const frameStyle = mergeStyles(
    frame.autoLayout
      ? (autoLayoutStyle(frame.autoLayout))
      : undefined,
    boxStyle(frame.style),
    {
      width: frame.width === "hug" ? "max-content" : `${frame.width}px`,
      height: frame.height === "hug" ? "auto" : `${frame.height}px`,
      minHeight: frame.minH ? `${frame.minH}px` : "1px",
      minWidth: frame.minW ? `${frame.minW}px` : "1px",
      maxWidth: frame.maxW ? `${frame.maxW}px` : undefined,
      maxHeight: frame.maxH ? `${frame.maxH}px` : undefined,
      overflow: frame.clip === false ? "visible" : "hidden",
    }
  )
  return createElement(
    "div",
    {
      className: "studio-frame",
      "data-mode": mode,
      "data-frame-id": frame.id,
      style: frameStyle,
    },
    ...frame.children
      .filter((node) => !node.hidden)
      .map((node) => renderNode(node, frame.autoLayout?.direction ?? "column"))
  )
}
