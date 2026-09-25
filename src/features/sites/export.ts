import { strToU8, zip, zipSync } from "fflate"
import type { SiteDocument } from "@/validators/sites/document"
import { siteDocumentSchema } from "@/validators/sites/document"

const archiveFiles = (input: SiteDocument) => {
  const doc = siteDocumentSchema.parse(input),
    files: Record<string, Uint8Array> = {}
  for (const [path, content] of Object.entries(doc.files))
    files[path] = strToU8(content)
  for (const [path, asset] of Object.entries(doc.assets))
    files[path] = Uint8Array.from(atob(asset.base64), (c) => c.charCodeAt(0))
  return files
}
export const exportSite = (input: SiteDocument) =>
  zipSync(archiveFiles(input), { level: 6 })
export const archiveSite = (input: SiteDocument) =>
  new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    zip(archiveFiles(input), { level: 6 }, (error, bytes) => {
      if (error) reject(error)
      else resolve(new Uint8Array(bytes))
    })
  })
export const downloadArchive = (
  bytes: Uint8Array<ArrayBuffer>,
  name: string
) => {
  const url = URL.createObjectURL(
      new Blob([bytes], { type: "application/zip" })
    ),
    link = document.createElement("a")
  link.href = url
  link.download = `${name.replace(/[^\p{L}\p{N}_-]/gu, "-") || "site"}.zip`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
