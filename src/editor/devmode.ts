import { type AnyNode, type Length, SPACING_TOKENS } from "@digit-ai-studio/shared"

const JUSTIFY_CSS = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const
const ALIGN_CSS = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const

/** CSS value with the token's px value in a comment, e.g. `var(--spacing-md) /* 16px *\/`. */
export function lengthCss(value: Length): string {
  if (typeof value === "number") return `${value}px /* ⚠ hors token */`
  const px = SPACING_TOKENS[value.token as keyof typeof SPACING_TOKENS]
  return px === undefined ? `var(--${value.token})` : `var(--${value.token}) /* ${px}px */`
}

export function layoutCss(node: AnyNode, size?: { width: number; height: number }): string[] {
  const lines: string[] = []
  if (size) lines.push(`width: ${Math.round(size.width)}px;`, `height: ${Math.round(size.height)}px;`)
  if (node.type === "box") {
    const l = node.autoLayout
    lines.push("display: flex;", `flex-direction: ${l.direction};`)
    if (l.wrap) lines.push("flex-wrap: wrap;")
    if (l.gap !== undefined && l.gap !== "auto") lines.push(`gap: ${lengthCss(l.gap)};`)
    if (l.justify) lines.push(`justify-content: ${JUSTIFY_CSS[l.justify]};`)
    if (l.align) lines.push(`align-items: ${ALIGN_CSS[l.align]};`)
    if (l.padding) lines.push(`padding: ${l.padding.map(lengthCss).join(" ")};`)
  }
  return lines
}

export function importSnippet(node: AnyNode): string | null {
  if (node.type === "component") return `import { ${node.component} } from 'digicomponents'`
  if (node.type === "template") return `// Template backoffice : ${node.template} (orchestration/back/src/layouts)`
  return null
}
