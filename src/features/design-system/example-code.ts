import type { ExampleOptions } from "./types"

// The preview's actual TSX is the documentation source. No separately maintained snippet.
export const createExampleCode =
  (source: string) =>
  (options: ExampleOptions): string => {
    const code =
      source
        .split("// @example:start")[1]
        ?.split("// @example:end")[0]
        ?.trim() ?? ""
    const signature = /\(\{\s*options\s*\}: ExampleProps\)/
    if (!signature.test(code)) return code
    return code
      .replace(signature, "()")
      .replace(
        /export function /,
        `const options: { variant: string; size: string; state: string } = ${JSON.stringify(options, null, 2)}\n\nexport function `
      )
  }
