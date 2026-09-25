import { useState, useSyncExternalStore } from "react"
import type { SiteDocument } from "@/validators/sites/document"
import { createExportSession } from "./export-session"
import { downloadArchive } from "./export"

export const useSiteExport = (doc: SiteDocument, name: string) => {
  const [session] = useState(createExportSession)
  const status = useSyncExternalStore(
    session.subscribe,
    session.get,
    session.get
  )
  const run = async () => {
    try {
      downloadArchive(await session.prepare(doc), name)
    } catch {
      /* The session keeps the error visible and allows retrying the same document. */
    }
  }
  return {
    exportStatus: status,
    onExport: () => {
      void run()
    },
  }
}
