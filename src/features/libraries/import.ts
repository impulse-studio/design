import { unzipSync } from "fflate"
import type { LibraryPayload } from "@/validators/libraries/payload"
import { payloadFromEntries } from "./ingestion"
import {
  createEntryCollector,
  entryKind,
  libraryLimits,
  unwrapLibraryEntries,
} from "./entries"

export { payloadFromEntries, discoverComponents } from "./ingestion"

export const readLibraryFiles = async (
  input: File[],
  framework: LibraryPayload["framework"]
) => {
  const collector = createEntryCollector()
  let inputSize = 0
  for (const file of input) {
    const path = file.webkitRelativePath || file.name
    const archive = file.name.endsWith(".zip")
    if (!archive && !entryKind(path)) continue
    inputSize += file.size
    if (inputSize > libraryLimits.bytes)
      throw new Error("Import limité à 10 Mo.")
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (archive) {
      let total = 0,
        count = 0
      const names = new Set<string>()
      const unpacked = unzipSync(bytes, {
        filter: (entry) => {
          if (entry.name.endsWith("/") || !entryKind(entry.name)) return false
          if (names.has(entry.name))
            throw new Error(`Chemin dupliqué : ${entry.name}`)
          names.add(entry.name)
          total += entry.originalSize
          count += 1
          if (total > libraryLimits.bytes || count > libraryLimits.files)
            throw new Error("Archive trop volumineuse.")
          return true
        },
      })
      for (const [entryPath, data] of Object.entries(
        unwrapLibraryEntries(unpacked)
      ))
        collector.add(entryPath, data)
    } else
      collector.add(
        file.webkitRelativePath ? path.slice(path.indexOf("/") + 1) : path,
        bytes
      )
  }
  if (Object.keys(collector.entries).length === 0)
    throw new Error("Aucun fichier de bibliothèque pris en charge.")
  return payloadFromEntries(collector.entries, framework, { stripRoot: false })
}

export const droppedLibraryFiles = async (
  items: DataTransferItemList
): Promise<File[]> => {
  const result: File[] = []
  const visit = async (entry: FileSystemEntry, path = ""): Promise<void> => {
    const relativePath = path + entry.name
    if (entry.isDirectory && !entryKind(`${relativePath}/placeholder.ts`))
      return
    if (entry.isFile) {
      if (!entryKind(relativePath)) return
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject)
      )
      Object.defineProperty(file, "webkitRelativePath", {
        value: path + file.name,
      })
      result.push(file)
      if (result.length > 250) throw new Error("Import limité à 250 fichiers.")
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader()
      for (;;) {
        const children = await new Promise<FileSystemEntry[]>(
          (resolve, reject) => reader.readEntries(resolve, reject)
        )
        if (!children.length) break
        for (const child of children)
          await visit(child, path + entry.name + "/")
      }
    }
  }
  const entries = Array.from(items).map((item) => ({
    entry: item.webkitGetAsEntry(),
    file: item.getAsFile(),
  }))
  for (const item of entries) {
    if (item.entry) await visit(item.entry)
    else if (item.file) result.push(item.file)
  }
  return result
}
