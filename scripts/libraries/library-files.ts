import { readdir, readFile, realpath, stat } from "node:fs/promises"
import { join, relative, sep } from "node:path"
import {
  createEntryCollector,
  entryKind,
  libraryLimits,
} from "../../src/features/libraries/entries"
import { payloadFromEntries } from "../../src/features/libraries/ingestion"
import type { LibraryPayload } from "../../src/validators/libraries/payload"

export const readLocalLibrary = async (
  directory: string,
  framework: LibraryPayload["framework"]
) => {
  const root = await realpath(directory)
  const collector = createEntryCollector()
  let bytes = 0,
    count = 0
  const visit = async (folder: string): Promise<void> => {
    for (const entry of (await readdir(folder, { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name)
    )) {
      if (entry.isSymbolicLink()) continue
      const path = join(folder, entry.name)
      const key = relative(root, path).split(sep).join("/")
      if (!entryKind(entry.isDirectory() ? `${key}/placeholder.ts` : key))
        continue
      const actual = await realpath(path)
      if (!actual.startsWith(root + sep))
        throw new Error("Chemin extérieur au dossier autorisé.")
      if (entry.isDirectory()) {
        await visit(path)
        continue
      }
      if (!entry.isFile()) continue
      const info = await stat(path)
      bytes += info.size
      count += 1
      if (bytes > libraryLimits.bytes || count > libraryLimits.files)
        throw new Error("Import limité à 250 fichiers et 10 Mo.")
      collector.add(key, await readFile(path))
    }
  }
  await visit(root)
  return payloadFromEntries(collector.entries, framework, { stripRoot: false })
}
