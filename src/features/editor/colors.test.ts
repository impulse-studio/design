import { describe, expect, it } from "vitest"
import {
  formatColor,
  hsvToRgb,
  parseColor,
  rgbToHsv,
  toHex,
} from "@/lib/colors"
import { resolveEditorColor, withEditorAlpha } from "./colors"
import { validateDocument } from "@digit-ai-studio/shared"
import { emptyDocument, framesOf } from "./document"
import { library } from "./library"

describe("color editing", () => {
  it("round trips RGB, HSV, shorthand HEX and transparency", () => {
    for (const color of [
      "#14B8A6",
      "#000000",
      "#FFFFFF",
      "#FF000080",
      "#AABBCC",
    ]) {
      const rgba = parseColor(color)!
      expect(toHex(hsvToRgb(rgbToHsv(rgba), rgba.a))).toBe(color)
    }
    expect(toHex(parseColor("#0f08")!)).toBe("#00FF0088")
    expect(parseColor("#12345")).toBeNull()
    expect(parseColor("hello")).toBeNull()
    expect(formatColor(parseColor("#FF0000")!, "hsl")).toBe("0, 100%, 50%")
    expect(toHex(parseColor("hsl(120, 100%, 50%)")!)).toBe("#00FF00")
    expect(toHex(parseColor("rgba(20, 184, 166, 0.5)")!)).toBe("#14B8A680")
  })
  it("preserves a token binding while changing only its opacity", () => {
    const color = withEditorAlpha({ token: "primary" }, 0.4)
    expect(color).toEqual({ token: "primary", alpha: 0.4 })
    expect(resolveEditorColor(color).a).toBe(0.4)
    const doc = emptyDocument()
    framesOf(doc)[0].style = { background: color }
    expect(() => validateDocument(doc, library)).not.toThrow()
  })
})
