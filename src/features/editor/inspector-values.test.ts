import { describe, expect, it } from "vitest"
import { parseNumberExpression } from "@/lib/number-expression"
import { parseColor, toHex } from "@/lib/colors"

describe("inspector expression parser", () => {
  it.each([
    ["1440 / 2 - 24", 696],
    ["(24 + 8) * 3", 96],
    ["-12.5", -12.5],
    ["12,5", 12.5],
    ["30px", 30],
    ["50%", 50],
    ["2 * -3", -6],
    ["-2^2", -4],
    ["2^-2", 0.25],
    ["2^3^2", 512],
  ])("evaluates %s", (input, output) =>
    expect(parseNumberExpression(String(input))).toBe(output)
  )
  it.each([
    "",
    "12/0",
    "NaN",
    "Infinity",
    "1e999",
    "2**4",
    "12abc",
    "Math.random()",
    "2+",
    "(2+4",
    "2)3",
  ])("rejects %s", (input) => expect(parseNumberExpression(input)).toBeNull())
  it("uses the original value for relative multiplication", () => {
    expect(parseNumberExpression("*2", 45)).toBe(90)
    expect(parseNumberExpression("/2", 45)).toBe(22.5)
    expect(parseNumberExpression("*2")).toBeNull()
  })
})

describe("color formats", () => {
  it.each([
    ["abc", "#AABBCC"],
    ["#F008", "#FF000088"],
    ["#12345680", "#12345680"],
    ["rgb(100% 0% 0% / 50%)", "#FF000080"],
    ["rgba(255, 0, 0, 0.5)", "#FF000080"],
    ["hsl(120 100% 50% / 25%)", "#00FF0040"],
    ["hsl(.5turn 100% 50%)", "#00FFFF"],
    ["  transparent  ", "#00000000"],
    ["255, 128, 0", "#FF8000"],
  ])("parses %s", (input, expected) =>
    expect(toHex(parseColor(input)!)).toBe(expected)
  )
  it.each([
    "rgb(1,2)",
    "rgb(1,2,3) garbage",
    "rgb(1,2,3,4,5)",
    "hsl(0,100,50)",
    "rgb(1deg,2,3)",
    "rgb(1,,2,3)",
    "not a color",
  ])("rejects malformed %s", (input) => expect(parseColor(input)).toBeNull())
})
