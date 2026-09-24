import type { CSSProperties } from "vue"

import type { AutoLayout, BoxStyle, Length, SelfLayout, TokenRef } from "@digit-ai-studio/shared"

// Tokens map to the CSS variables defined by digicomponents (src/style/main.css); colors are stored as HSL channels.

export function length(value: Length | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}px` : `var(--${value.token})`
}

export function color(ref: TokenRef | undefined): string | undefined {
  if (!ref) return undefined
  return `hsl(var(--${ref.token}))`
}

const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const
const ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const

export function autoLayoutStyle(layout: AutoLayout): CSSProperties {
  const gap = layout.gap === "auto" ? undefined : length(layout.gap)
  return {
    display: "flex",
    flexDirection: layout.direction,
    flexWrap: layout.wrap ? "wrap" : "nowrap",
    gap,
    padding: layout.padding?.map((p) => length(p) ?? "0").join(" "),
    justifyContent: layout.gap === "auto" ? "space-between" : JUSTIFY[layout.justify ?? "start"],
    alignItems: ALIGN[layout.align ?? "stretch"],
  }
}

export function selfLayoutStyle(layout: SelfLayout | undefined, parentDirection: "row" | "column"): CSSProperties {
  if (!layout) return {}
  const style: CSSProperties = {}
  const axis = (size: SelfLayout["width"], main: boolean, prop: "width" | "height") => {
    if (!size) return
    if (size.mode === "fixed") style[prop] = `${size.value ?? 0}px`
    else if (size.mode === "fill") {
      if (main) style.flex = "1 1 0"
      else style.alignSelf = "stretch"
      style[prop === "width" ? "minWidth" : "minHeight"] = 0
    } else style[prop] = "max-content"
  }
  axis(layout.width, parentDirection === "row", "width")
  axis(layout.height, parentDirection === "column", "height")
  if (layout.minW) style.minWidth = `${layout.minW}px`
  if (layout.maxW) style.maxWidth = `${layout.maxW}px`
  if (layout.alignSelf) style.alignSelf = ALIGN[layout.alignSelf]
  return style
}

export function boxStyle(style: BoxStyle | undefined): CSSProperties {
  if (!style) return {}
  return {
    background: color(style.background),
    border: style.border ? `${style.border.width}px solid ${color(style.border.color)}` : undefined,
    borderRadius: style.radius ? `var(--${style.radius.token})` : undefined,
  }
}
