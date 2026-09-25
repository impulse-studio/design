import { library } from "./library"

const tokenNames = (category: string) =>
  Object.keys(library.tokens[category] ?? {})

// Token names offered by the inspector's length fields, per property kind.
export const lengthTokens = {
  spacing: tokenNames("spacing"),
  radius: tokenNames("radius"),
  text: tokenNames("text").filter((name) => name.startsWith("font-size")),
}
