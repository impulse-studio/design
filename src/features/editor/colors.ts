import type { Color, MockupDoc } from "@digit-ai-studio/shared"
import { walk } from "@digit-ai-studio/shared"
import { resolveColor, withAlpha } from "@/lib/colors"
import { library } from "./library"

// Color helpers bound to the manifest's color tokens.
export const colorTokens = library.tokens.color
export const resolveEditorColor = (value: Color | undefined) =>
  resolveColor(value, colorTokens)
export const withEditorAlpha = (value: Color | undefined, a: number) =>
  withAlpha(value, a, colorTokens)
export const pageColors = (doc: MockupDoc): Color[] => {
  const colors = new Map<string, Color>()
  for (const page of doc.pages)
    for (const frame of page.frames)
      walk(frame, (node) => {
        for (const value of [
          node.style?.background,
          node.style?.border?.color,
          node.type === "text" ? node.color : undefined,
        ])
          if (value) colors.set(JSON.stringify(value), value)
      })
  return [...colors.values()].slice(0, 32)
}
