import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { createRequire } from "node:module"
import type * as Esbuild from "esbuild-wasm"
import { compileOptions } from "./compiler"
import type { RuntimeModules } from "./compiler"
import type { SiteDocument } from "./schema"

const { build } = createRequire(import.meta.url)(
  "esbuild-wasm"
) as typeof Esbuild

let runtime: Promise<RuntimeModules> | undefined

export const validateSiteBuild = async (doc: SiteDocument) => {
  runtime ??= readFile(
    resolve(
      process.cwd(),
      process.env.NODE_ENV === "production" ? ".output/public" : "public",
      "site-runtime/modules.json"
    ),
    "utf8"
  )
    .then((value) => JSON.parse(value) as RuntimeModules)
    .catch((error: unknown) => {
      runtime = undefined
      throw error
    })
  await build(compileOptions(doc, await runtime))
}
