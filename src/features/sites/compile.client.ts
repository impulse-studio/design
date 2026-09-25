import * as esbuild from "esbuild-wasm"
import { compileOptions } from "./compiler"
import type { RuntimeModules } from "./compiler"
import type { SiteDocument } from "./schema"
import { bridgeSource } from "./bridge"

let initialized: Promise<unknown> | undefined
let runtime: Promise<RuntimeModules> | undefined
export const compileSite = async (
  doc: SiteDocument,
  preview?: { token: string; revision: number; path: string; editing: boolean }
) => {
  initialized ??= esbuild
    .initialize({ wasmURL: "/site-runtime/esbuild.wasm" })
    .catch((error) => {
      initialized = undefined
      throw error
    })
  runtime ??= fetch("/site-runtime/modules.json")
    .then(async (response) => {
      if (!response.ok)
        throw new Error(
          "Le compilateur est indisponible. Lancez pnpm prepare:sites."
        )
      return response.json() as Promise<RuntimeModules>
    })
    .catch((error) => {
      runtime = undefined
      throw error
    })
  await initialized
  const extra: Record<string, string> = preview
    ? {
        "studio-entry.ts": `import './studio-bridge';import './src/main';`,
        "studio-bridge.ts": bridgeSource(
          preview.token,
          preview.revision,
          preview.path,
          preview.editing,
          Boolean(doc.files[doc.kind === "vue-vite" ? "src/routes/router.ts" : "src/routes/router.tsx"]),
          doc.kind
        ),
      }
    : {}
  const result = await esbuild.build(compileOptions(doc, await runtime, extra))
  return result.outputFiles?.[0].text ?? ""
}
