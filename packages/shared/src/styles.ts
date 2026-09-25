import type { AutoLayout, BoxStyle, Color, Length, SelfLayout } from "./doc"

type CSSProperties = Record<string, string | number | undefined>

export const length = (value: Length | undefined): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "number"
      ? `${value}px`
      : `var(--${value.token})`
export const color = (value: Color | undefined): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "string"
      ? value
      : `hsl(var(--${value.token}) / ${value.alpha ?? 1})`
const JUSTIFY = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
} as const
const ALIGN = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const
export const autoLayoutStyle = (layout: AutoLayout): CSSProperties => {
  const grid = layout.direction === "grid"
  const wrapped = layout.direction === "row" && layout.wrap
  return {
    display: grid ? "grid" : "flex",
    position: "relative",
    flexDirection: grid ? undefined : layout.direction,
    flexWrap: wrapped ? "wrap" : "nowrap",
    gridTemplateColumns: grid
      ? `repeat(${layout.gridColumns ?? 2}, minmax(0, 1fr))`
      : undefined,
    gap: layout.gap === "auto" ? undefined : length(layout.gap),
    rowGap:
      grid || wrapped
        ? length(layout.crossGap ?? (layout.gap === "auto" ? 0 : layout.gap))
        : undefined,
    padding: layout.padding?.map((p) => length(p) ?? "0").join(" "),
    justifyContent: grid
      ? undefined
      : layout.gap === "auto"
        ? JUSTIFY[
            layout.justify === "around" || layout.justify === "evenly"
              ? layout.justify
              : "between"
          ]
        : JUSTIFY[layout.justify ?? "start"],
    alignItems: ALIGN[layout.align ?? "stretch"],
    justifyItems: grid
      ? ALIGN[
          layout.justify === "center" || layout.justify === "end"
            ? layout.justify
            : "start"
        ]
      : undefined,
    minHeight: "1px",
    minWidth: "1px",
  }
}
export const selfLayoutStyle = (
  layout: SelfLayout | undefined,
  parentDirection: "row" | "column" | "grid"
): CSSProperties => {
  if (!layout) return {}
  const style: CSSProperties = { boxSizing: "border-box" }
  const axis = (
    size: SelfLayout["width"],
    main: boolean,
    prop: "width" | "height"
  ) => {
    if (!size) return
    if (size.mode === "fixed") {
      style[prop] = `${size.value ?? 100}px`
      style.flexShrink = 0
    } else if (size.mode === "fill") {
      if (parentDirection === "grid") {
        style[prop] = "100%"
        style[prop === "width" ? "minWidth" : "minHeight"] = 0
        return
      }
      if (main) style.flex = "1 1 0"
      else {
        style.alignSelf = "stretch"
        style[prop] = "100%"
      }
      style[prop === "width" ? "minWidth" : "minHeight"] = 0
    } else style[prop] = "max-content"
  }
  axis(layout.width, parentDirection === "row", "width")
  axis(layout.height, parentDirection === "column", "height")
  if (layout.minW !== undefined) style.minWidth = `${layout.minW}px`
  if (layout.maxW !== undefined) style.maxWidth = `${layout.maxW}px`
  if (layout.minH !== undefined) style.minHeight = `${layout.minH}px`
  if (layout.maxH !== undefined) style.maxHeight = `${layout.maxH}px`
  if (layout.alignSelf) style.alignSelf = ALIGN[layout.alignSelf]
  if (layout.position && layout.position !== "flow") {
    style.position = "absolute"
    style.left = `${layout.position.x}px`
    style.top = `${layout.position.y}px`
  }
  return style
}
export const boxStyle = (style: BoxStyle | undefined): CSSProperties =>
  style
    ? {
        background:
          style.backgroundVisible === false
            ? "transparent"
            : color(style.background),
        border:
          style.border?.visible === false
            ? "none"
            : style.border
              ? `${style.border.width}px solid ${color(style.border.color)}`
              : undefined,
        borderRadius: length(style.radius),
        opacity: style.opacity,
        boxShadow:
          typeof style.shadow === "object"
            ? `var(--${style.shadow.token})`
            : style.shadow,
      }
    : {}
