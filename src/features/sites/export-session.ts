import type { SiteDocument } from "@/validators/sites/document"
import { siteDocumentSchema } from "@/validators/sites/document"
import { archiveSite } from "./export"
import { prepareSiteExport } from "./runtime"

export type ExportStatus = {
  stage: "idle" | "installing" | "building" | "archiving" | "ready" | "error"
  message: string
}
type ExportPorts = {
  prepare: (
    doc: SiteDocument,
    onStage: (stage: "installing" | "building") => void
  ) => Promise<SiteDocument>
  archive: (doc: SiteDocument) => Promise<Uint8Array<ArrayBuffer>>
}
const messages = {
  installing: "Installation des dépendances…",
  building: "Vérification du projet…",
  archiving: "Création du ZIP…",
}

export const createExportSession = ({
  prepare = prepareSiteExport,
  archive = archiveSite,
}: Partial<ExportPorts> = {}) => {
  let status: ExportStatus = { stage: "idle", message: "" }
  const listeners = new Set<() => void>()
  const cache = new Map<string, Uint8Array<ArrayBuffer>>()
  let pending: {
    key: string
    result: Promise<Uint8Array<ArrayBuffer>>
  } | null = null
  const update = (next: ExportStatus) => {
    status = next
    listeners.forEach((listener) => listener())
  }
  const prepareArchive = (input: SiteDocument) => {
    const doc = siteDocumentSchema.parse(input)
    const key = JSON.stringify(doc)
    if (pending)
      return pending.key === key
        ? pending.result
        : Promise.reject(new Error("Un export est déjà en préparation."))
    const cached = cache.get(key)
    if (cached) {
      update({ stage: "ready", message: "Export prêt" })
      return Promise.resolve(cached)
    }
    const result = Promise.resolve().then(async () => {
      try {
        const prepared = await prepare(doc, (stage) =>
          update({ stage, message: messages[stage] })
        )
        update({ stage: "archiving", message: messages.archiving })
        const bytes = await archive(prepared)
        cache.set(key, bytes)
        if (cache.size > 2) cache.delete(cache.keys().next().value!)
        update({ stage: "ready", message: "Export prêt" })
        return bytes
      } catch (reason) {
        update({
          stage: "error",
          message:
            reason instanceof Error
              ? reason.message
              : "Export impossible. Réessayez.",
        })
        throw reason
      } finally {
        pending = null
      }
    })
    pending = { key, result }
    update({ stage: "installing", message: messages.installing })
    return result
  }
  return {
    prepare: prepareArchive,
    get: () => status,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
