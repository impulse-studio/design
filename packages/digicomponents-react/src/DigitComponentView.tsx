import { createElement } from "react"
import type { CSSProperties, ReactNode } from "react"
import type { Json } from "@digit-ai-studio/shared"
import snapshotsData from "./snapshots.generated.json"

type SnapshotText = { type: "text"; text: string }
type SnapshotElement = {
  type: "element"
  tag: string
  attributes: Record<string, string>
  children: SnapshotNode[]
}
type SnapshotNode = SnapshotText | SnapshotElement
type SnapshotVariant = {
  props: Record<string, Json>
  html: string
  tree: SnapshotNode[]
  error?: string
}
type ComponentSnapshot = {
  slots: string[]
  textProps: string[]
  defaults: Record<string, Json>
  variants: SnapshotVariant[]
}
type SnapshotRegistry = {
  components: Record<string, ComponentSnapshot | undefined>
}
// JSON imports widen discriminants and merge optional object keys. Publication validates the tree.
const snapshots = snapshotsData as unknown as SnapshotRegistry
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
const parseInlineStyle = (text: string): CSSProperties => {
  const style: Record<string, string> = {}
  for (const declaration of text.split(";")) {
    const separator = declaration.indexOf(":")
    if (separator < 1) continue
    const key = declaration.slice(0, separator).trim()
    const value = declaration.slice(separator + 1).trim()
    if (key && value) style[key.startsWith("--") ? key : camelCase(key)] = value
  }
  return style
}
const replaceText = (
  value: string,
  textProps: string[],
  props: Record<string, unknown>
) =>
  textProps.reduce(
    (result, name) =>
      result.replaceAll(
        `__DIGIT_PROP_${name.toUpperCase()}__`,
        String(props[name] ?? "")
      ),
    value
  )
const scoreVariant = (
  variant: SnapshotVariant,
  props: Record<string, unknown>
) =>
  Object.entries(variant.props).reduce(
    (score, [name, value]) => score + (props[name] === value ? 0 : 1),
    0
  )
const plainText = (
  nodes: SnapshotNode[],
  textProps: string[],
  props: Record<string, unknown>
): string =>
  nodes
    .map((node) =>
      node.type === "text"
        ? replaceText(node.text, textProps, props)
        : plainText(node.children, textProps, props)
    )
    .join("")
const safeUrl = (value: string) =>
  /^(?:https?:\/\/|mailto:|tel:|#|\/|\.\/|\.\.\/|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(
    value
  )
const rootAttributes = new Set([
  "accept",
  "alt",
  "autoFocus",
  "checked",
  "disabled",
  "download",
  "form",
  "href",
  "id",
  "max",
  "min",
  "multiple",
  "name",
  "placeholder",
  "readOnly",
  "rel",
  "required",
  "role",
  "rows",
  "src",
  "step",
  "tabIndex",
  "target",
  "title",
  "value",
])
const booleanRootAttributes = new Set([
  "autoFocus",
  "checked",
  "disabled",
  "download",
  "multiple",
  "readOnly",
  "required",
])

export function DigitComponentView({
  component,
  props = {},
  nodeId,
  text,
  slots = {},
  children,
  style,
}: {
  component: string
  props?: Record<string, unknown>
  nodeId?: string
  text?: string
  slots?: Record<string, ReactNode[]>
  children?: ReactNode
  style?: CSSProperties
}) {
  const snapshot = snapshots.components[component]
  const resolvedProps = {
    ...(snapshot?.defaults ?? {}),
    ...props,
  }
  const variant = snapshot?.variants
    .map((value) => ({ value, score: scoreVariant(value, resolvedProps) }))
    .sort((a, b) => a.score - b.score)
    .at(0)?.value
  let rootApplied = false
  const renderNode = (node: SnapshotNode, key: string): ReactNode => {
    if (node.type === "text")
      return replaceText(node.text, snapshot?.textProps ?? [], resolvedProps)
    const slot = node.attributes["data-digit-slot"]
    if (slot) {
      const slotContent =
        slots[slot] ??
        (slot === "default" &&
        (text !== undefined || typeof props.text === "string")
          ? [
              createElement(
                "span",
                { "data-editor-text": nodeId },
                text ?? String(props.text)
              ),
            ]
          : slot === "default" && children !== undefined
            ? [children]
            : [])
      return createElement(
        "span",
        {
          key,
          "data-digit-slot-root": slot,
          style: { display: "contents" },
        },
        ...slotContent
      )
    }
    const attributes: Record<string, unknown> = {}
    for (const [name, raw] of Object.entries(node.attributes)) {
      if (name === "data-digit-slot" || /^on/i.test(name)) continue
      const value = replaceText(raw, snapshot?.textProps ?? [], resolvedProps)
      if (
        ["href", "src", "xlink:href"].includes(name.toLowerCase()) &&
        !safeUrl(value)
      )
        continue
      const keyName = reactProperty(name)
      if (
        [
          "checked",
          "disabled",
          "multiple",
          "readOnly",
          "required",
          "selected",
          "autoFocus",
        ].includes(keyName)
      )
        attributes[keyName] = true
      else if (name === "style") attributes.style = parseInlineStyle(value)
      else attributes[keyName] = value
    }
    if (node.tag === "input") {
      if (Object.hasOwn(attributes, "value")) {
        attributes.defaultValue = attributes.value
        delete attributes.value
      }
      if (Object.hasOwn(attributes, "checked")) {
        attributes.defaultChecked = attributes.checked
        delete attributes.checked
      }
    }
    if (node.tag === "textarea") {
      attributes.defaultValue = plainText(
        node.children,
        snapshot?.textProps ?? [],
        resolvedProps
      )
    }
    if (!rootApplied) {
      rootApplied = true
      for (const [name, value] of Object.entries(resolvedProps)) {
        const keyName = name === "formId" ? "form" : reactProperty(name)
        const isDataOrAria = /^(?:data-|aria-)/.test(name)
        const isControlType =
          keyName === "type" &&
          ["button", "input", "select", "textarea"].includes(node.tag)
        if (!rootAttributes.has(keyName) && !isDataOrAria && !isControlType)
          continue
        if (
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean"
        )
          continue
        if (
          ["href", "src"].includes(keyName) &&
          typeof value === "string" &&
          !safeUrl(value)
        )
          continue
        if (booleanRootAttributes.has(keyName)) {
          if (value) attributes[keyName] = true
          else delete attributes[keyName]
        } else {
          attributes[keyName] = String(value)
        }
      }
      const dynamicClass = props.className ?? props.class
      if (typeof dynamicClass === "string")
        attributes.className = [attributes.className, dynamicClass]
          .filter((value) => typeof value === "string" && value)
          .join(" ")
      attributes.style = {
        ...(attributes.style as CSSProperties | undefined),
        ...style,
      }
    }
    const nested =
      node.tag === "textarea"
        ? []
        : node.children.map((child, index) =>
            renderNode(child, `${key}.${index}`)
          )
    return createElement(
      node.tag,
      { ...attributes, key: `${component}:${key}` },
      ...nested
    )
  }
  const content = (variant?.tree ?? []).map((node, index) =>
    renderNode(node, String(index))
  )
  const eventProps: Record<string, unknown> = {}
  for (const name of [
    "onClick",
    "onChange",
    "onFocus",
    "onBlur",
    "onKeyDown",
    "onSubmit",
  ])
    if (typeof props[name] === "function") eventProps[name] = props[name]
  return createElement(
    "div",
    {
      ...eventProps,
      "data-digit-component": component,
      ...(nodeId ? { "data-editor-node": nodeId } : {}),
      style: { display: nodeId ? "contents" : undefined },
    },
    ...content
  )
}
