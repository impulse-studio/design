import type { Color } from "@digit-ai-studio/shared"

/** Color token name → HSL channels, e.g. `{ primary: "221 83% 53%" }`. */
export type ColorTokens = Record<string, string>
export type ColorFormat = "hex" | "rgb" | "hsl" | "css"
export type RGBA = { r: number; g: number; b: number; a: number }
export type HSV = { h: number; s: number; v: number }
export const clamp = (n: number, max = 1) => Math.max(0, Math.min(max, n))
export const hsvToRgb = ({ h, s, v }: HSV, a = 1): RGBA => {
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) =>
    Math.round(255 * (v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1))))
  return { r: f(5), g: f(3), b: f(1), a }
}
export const rgbToHsv = ({ r, g, b }: RGBA): HSV => {
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min
  const h =
    delta === 0
      ? 0
      : max === r
        ? ((g - b) / delta) % 6
        : max === g
          ? (b - r) / delta + 2
          : (r - g) / delta + 4
  return {
    h: (h * 60 + 360) % 360,
    s: max === 0 ? 0 : delta / max,
    v: max / 255,
  }
}
export const toHex = ({ r, g, b, a }: RGBA, alpha = true) =>
  "#" +
  [r, g, b, ...(alpha && a < 1 ? [a * 255] : [])]
    .map((n) => Math.round(clamp(n, 255)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
export const parseColor = (input: string): RGBA | null => {
  const value = input.trim().replace(/^#/, "")
  if (/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    const hex = value.length < 5 ? [...value].map((c) => c + c).join("") : value
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1,
    }
  }
  const text = input.trim().toLowerCase()
  if (text === "transparent") return { r: 0, g: 0, b: 0, a: 0 }
  const functional = /^(rgba?|hsla?)\((.*)\)$/.exec(text)
  const body = functional?.[2] ?? text
  if (!functional && /[^\d.,%+\s-]/.test(body)) return null
  const parts = body.trim().split(/\s*[,/]\s*|\s+/)
  if (
    parts.length < 3 ||
    parts.length > 4 ||
    parts.some(
      (part) => !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:%|deg|turn|rad)?$/.test(part)
    )
  )
    return null
  const values = parts.map(parseFloat)
  if (!values.every(Number.isFinite)) return null
  if (parts[3] && !/^[+-]?(?:\d+\.?\d*|\.\d+)%?$/.test(parts[3])) return null
  const a = clamp(parts[3]?.endsWith("%") ? values[3] / 100 : (values[3] ?? 1))
  if (functional?.[1].startsWith("hsl")) {
    if (
      !parts[1].endsWith("%") ||
      !parts[2].endsWith("%") ||
      parts[0].endsWith("%")
    )
      return null
    const h =
      values[0] *
      (parts[0].endsWith("turn")
        ? 360
        : parts[0].endsWith("rad")
          ? 180 / Math.PI
          : 1)
    const saturation = clamp(values[1] / 100),
      l = clamp(values[2] / 100)
    const v = l + saturation * Math.min(l, 1 - l)
    return hsvToRgb(
      { h: ((h % 360) + 360) % 360, s: v === 0 ? 0 : 2 * (1 - l / v), v },
      a
    )
  }
  if (parts.slice(0, 3).some((part) => /(?:deg|turn|rad)$/.test(part)))
    return null
  const channels = values
    .slice(0, 3)
    .map((number, index) =>
      clamp(parts[index].endsWith("%") ? (number * 255) / 100 : number, 255)
    )
  return { r: channels[0], g: channels[1], b: channels[2], a }
}
export const resolveColor = (
  value: Color | undefined,
  tokens: ColorTokens = {}
): RGBA => {
  if (typeof value === "object") {
    const channels = tokens[value.token]
    return {
      ...(parseColor(`hsl(${channels})`) ?? { r: 128, g: 128, b: 128, a: 1 }),
      a: value.alpha ?? 1,
    }
  }
  return parseColor(value ?? "#FFFFFF") ?? { r: 255, g: 255, b: 255, a: 1 }
}
export const colorCss = (value: Color | undefined, tokens?: ColorTokens) =>
  toHex(resolveColor(value, tokens))
export const withAlpha = (
  value: Color | undefined,
  a: number,
  tokens?: ColorTokens
): Color =>
  typeof value === "object"
    ? { ...value, alpha: a }
    : toHex({ ...resolveColor(value, tokens), a })
export const formatColor = (color: RGBA, format: ColorFormat) => {
  if (format === "rgb")
    return `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`
  if (format === "hsl") {
    const { h, s, v } = rgbToHsv(color),
      l = v * (1 - s / 2),
      saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
    return `${Math.round(h)}, ${Math.round(saturation * 100)}%, ${Math.round(l * 100)}%`
  }
  if (format === "css")
    return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${Math.round(color.a * 100) / 100})`
  return toHex(color, false).slice(1)
}
/**
 * Parses a color typed in the given format. Without an explicit alpha, the
 * fallback alpha is kept so editing the hex code does not reset opacity.
 */
export const parseColorInput = (
  input: string,
  format: ColorFormat,
  fallbackAlpha: number
): RGBA | null => {
  const next = input.trim()
  const parsed = parseColor(
    format === "hsl" && !/^hsla?\(/i.test(next) ? `hsl(${next})` : next
  )
  if (!parsed) return null
  const explicitAlpha =
    /^#?(?:[\da-f]{4}|[\da-f]{8})$/i.test(next) ||
    /^(?:rgba|hsla)\(/i.test(next) ||
    next.includes("/") ||
    next.toLowerCase() === "transparent"
  return {
    ...parsed,
    a: explicitAlpha || format === "css" ? parsed.a : fallbackAlpha,
  }
}
