import { createClientOnlyFn } from "@tanstack/react-start"
import type { SiteDocument } from "./schema"

export const compileSite = createClientOnlyFn(
  async (
    doc: SiteDocument,
    preview?: {
      token: string
      revision: number
      path: string
      editing: boolean
    }
  ) => {
    const compiler = await import("./compile.client")
    return compiler.compileSite(doc, preview)
  }
)
