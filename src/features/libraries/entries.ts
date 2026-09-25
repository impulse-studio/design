import { filePathSchema } from "@/validators/sites/paths"
import type { LibraryPayload } from "@/validators/libraries/payload"

export const libraryLimits = { files: 250, bytes: 10_000_000 }
const assets: Record<
  string,
  LibraryPayload["assets"][string]["mime"] | undefined
> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  woff2: "font/woff2",
}
export const entryKind = (path: string) => {
  const parts = path.split("/")
  if (
    parts.some((part) =>
      ["..", ".", "__proto__", "constructor", "prototype", ""].includes(part)
    ) ||
    path.includes("\\")
  )
    throw new Error(`Chemin interdit : ${path}`)
  if (
    parts.some(
      (part) =>
        part.startsWith(".") ||
        ["node_modules", "dist", "credentials", "secrets"].includes(part)
    ) ||
    /(?:^|\/)(?:credentials|secrets)(?:\.|\/|$)|\.(?:pem|key|p12)$/i.test(path)
  )
    return null
  filePathSchema.parse(path)
  const asset = assets[parts.at(-1)!.split(".").at(-1)!.toLowerCase()]
  return asset ?? (/\.(vue|[jt]sx?|css|json)$/.test(path) ? "text" : null)
}
export const createEntryCollector = () => {
  const entries: Record<string, Uint8Array> = Object.create(null)
  let size = 0,
    count = 0
  return {
    entries,
    add: (path: string, bytes: Uint8Array) => {
      if (!entryKind(path)) return
      if (Object.hasOwn(entries, path))
        throw new Error(`Chemin dupliqué : ${path}`)
      size += bytes.byteLength
      count += 1
      if (size > libraryLimits.bytes || count > libraryLimits.files)
        throw new Error("Import limité à 250 fichiers et 10 Mo.")
      entries[path] = bytes
    },
  }
}

/** ZIP wrappers are optional; conventional source folders already belong to the project. */
export const unwrapLibraryEntries = (entries: Record<string, Uint8Array>) => {
  const paths = Object.keys(entries)
  const root = paths[0]?.split("/")[0]
  if (
    !root ||
    ["src", "assets", "public", "components"].includes(root) ||
    !paths.every((path) => path.startsWith(`${root}/`))
  )
    return entries
  return Object.fromEntries(
    Object.entries(entries).map(([path, bytes]) => [
      path.slice(root.length + 1),
      bytes,
    ])
  )
}
