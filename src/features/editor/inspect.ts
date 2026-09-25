import type { AnyNode, Json } from "@digit-ai-studio/shared"
import {
  autoLayoutStyle,
  boxStyle,
  childLists,
  color,
  length,
  selfLayoutStyle,
  walk,
} from "@digit-ai-studio/shared"

const jsxProperty = (name: string) =>
  name === "class"
    ? "className"
    : name === "for"
      ? "htmlFor"
      : name === "tabindex"
        ? "tabIndex"
        : name
const jsxValue = (value: Json) => `{${JSON.stringify(value)}}`
const jsxAttributes = (values: Record<string, Json>) =>
  Object.entries(values)
    .filter(([name]) => !/^on/i.test(name) && name.toLowerCase() !== "srcdoc" && name !== "style")
    .map(([name, value]) => `${jsxProperty(name)}=${jsxValue(value)}`)
const jsxStyle = (styles: Record<string, unknown>) => {
  const defined = Object.fromEntries(
    Object.entries(styles).filter(([, value]) => value !== undefined)
  )
  return Object.keys(defined).length ? ` style={${JSON.stringify(defined)}}` : ""
}
const elementStyles = (value: string | undefined) => {
  if (!value) return {}
  return Object.fromEntries(
    value.split(";").flatMap((declaration) => {
      const separator = declaration.indexOf(":")
      if (separator < 1) return []
      const rawKey = declaration.slice(0, separator).trim()
      const key = rawKey.startsWith("--")
        ? rawKey
        : rawKey.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
      const content = declaration.slice(separator + 1).trim()
      return rawKey && content ? [[key, content]] : []
    })
  )
}
const nodeStyles = (
  node: AnyNode,
  direction: "row" | "column" | "grid"
): Record<string, unknown> => ({
  ...((node.type === "box" || node.type === "frame") && node.autoLayout
    ? autoLayoutStyle(node.autoLayout)
    : {}),
  ...(node.type === "frame"
    ? {
        width: node.width === "hug" ? "max-content" : `${node.width}px`,
        height: node.height === "hug" ? "auto" : `${node.height}px`,
        minWidth: node.minW === undefined ? undefined : `${node.minW}px`,
        maxWidth: node.maxW === undefined ? undefined : `${node.maxW}px`,
        minHeight: node.minH === undefined ? undefined : `${node.minH}px`,
        maxHeight: node.maxH === undefined ? undefined : `${node.maxH}px`,
        position: "relative",
        overflow: node.clip === false ? "visible" : "hidden",
      }
    : "layout" in node
      ? selfLayoutStyle(node.layout, direction)
      : {}),
  ...(node.type === "box" ? { overflow: node.clip ? "hidden" : "visible" } : {}),
  ...boxStyle(node.style),
})

export const reactSnippet = (
  node: AnyNode,
  depth = 0,
  direction: "row" | "column" | "grid" = "column"
): string => {
  const indent = "  ".repeat(depth)
  const childrenOf = (children: AnyNode[], childDirection = "column" as const) =>
    children
      .map((child) => reactSnippet(child, depth + 1, childDirection))
      .join("\n")

  if (node.type === "component") {
    const props: Record<string, Json> = {
      ...(node.localVariant?.props ?? {}),
      ...(node.props ?? {}),
    }
    const text = node.text ?? node.localVariant?.text
    if (text !== undefined && !node.slots?.default) props.text = text
    const attributes = jsxAttributes(props)
    const styles = {
      ...selfLayoutStyle(node.localVariant?.layout, direction),
      ...selfLayoutStyle(node.layout, direction),
      ...boxStyle(node.localVariant?.style),
      ...boxStyle(node.style),
    }
    const slots = Object.entries(node.slots ?? {})
      .filter(([name]) => name !== "default")
      .map(([name, children]) =>
        `${name}: [${children.map((child) => reactSnippet(child, depth + 2).trim()).join(", ")}]`
      )
    const slotProp = slots.length ? ` slots={{ ${slots.join(", ")} }}` : ""
    const defaultChildren = node.slots?.default ?? []
    const content = defaultChildren.length
      ? `\n${childrenOf(defaultChildren)}\n${indent}`
      : ""
    return `${indent}<${node.component}${attributes.length ? ` ${attributes.join(" ")}` : ""}${slotProp}${jsxStyle(styles)}>${content}</${node.component}>`
  }

  if (node.type === "element") {
    const attributes = jsxAttributes((node.attributes ?? {}) as Record<string, Json>)
    if (node.className) attributes.push(`className=${jsxValue(node.className)}`)
    const styles = {
      ...elementStyles(node.inlineStyle),
      ...selfLayoutStyle(node.layout, direction),
      ...boxStyle(node.style),
    }
    const content = childrenOf(node.children)
    return `${indent}<${node.tag}${attributes.length ? ` ${attributes.join(" ")}` : ""}${jsxStyle(styles)}>${content ? `\n${content}\n${indent}` : ""}</${node.tag}>`
  }

  if (node.type === "image")
    return `${indent}<img src={${JSON.stringify(node.src)}} alt={${JSON.stringify(node.name ?? "")}}${jsxStyle({
      ...nodeStyles(node, direction),
      objectFit: node.fit ?? "cover",
      borderRadius: length(node.radius),
    })} />`

  if (node.type === "text")
    return `${indent}<p${jsxStyle({
      ...nodeStyles(node, direction),
      fontSize: length(node.fontSize ?? node.textStyle),
      color: color(node.color),
      fontWeight: node.weight,
      textAlign: node.textAlign,
      lineHeight: node.lineHeight,
    })}>{${JSON.stringify(node.content)}}</p>`

  const tag = node.type === "template" ? "div" : "div"
  const className = node.type === "template" ? ' className="digit-event-layout"' : ""
  const childNodes = childLists(node).flatMap((list) => list.nodes)
  const childDirection = node.type === "box" || node.type === "frame"
    ? node.autoLayout?.direction ?? "column"
    : "column"
  const content = childrenOf(childNodes, childDirection)
  return `${indent}<${tag}${className}${jsxStyle(nodeStyles(node, direction))}>${content ? `\n${content}\n${indent}` : ""}</${tag}>`
}

export const reactImports = (node: AnyNode) => {
  const components = new Set<string>()
  walk(node, (child) => {
    if (child.type === "component") components.add(child.component)
  })
  return components.size
    ? `import { ${[...components].join(", ")} } from "@digit-ai-studio/digicomponents-react"`
    : ""
}

export const usedTokens = (node: AnyNode) => {
  const tokens = new Set<string>()
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return
    if ("token" in value && typeof value.token === "string")
      tokens.add(value.token)
    else for (const child of Object.values(value)) visit(child)
  }
  visit(node)
  return [...tokens]
}

export const hasCustomStyles = (node: AnyNode): boolean => {
  const custom = (value: unknown): boolean =>
    !!value &&
    (typeof value === "string" ||
      typeof value === "number" ||
      (typeof value === "object" &&
        !("token" in value) &&
        Object.values(value).some(custom)))
  return (
    custom(node.style) ||
    (node.type === "component" && custom(node.localVariant?.style)) ||
    (node.type === "text" && (custom(node.color) || custom(node.fontSize)))
  )
}
