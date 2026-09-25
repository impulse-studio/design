import { strToU8, zipSync } from "fflate"
import type { SiteDocument } from "./schema"
import { siteDocumentSchema } from "./schema"

export const exportSite = (input: SiteDocument) => {
  const doc = siteDocumentSchema.parse(input),
    files: Record<string, Uint8Array> = {}
  for (const [path, content] of Object.entries(doc.files))
    files[path] = strToU8(content)
  for (const [path, asset] of Object.entries(doc.assets))
    files[path] = Uint8Array.from(atob(asset.base64), (c) => c.charCodeAt(0))
  return zipSync(files, { level: 6 })
}
export const downloadSite = (doc: SiteDocument, name: string) => {
  const bytes = exportSite(doc),
    url = URL.createObjectURL(new Blob([bytes], { type: "application/zip" })),
    link = document.createElement("a")
  link.href = url
  link.download = `${name.replace(/[^\p{L}\p{N}_-]/gu, "-") || "site"}.zip`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
