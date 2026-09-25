import type { Snapshot } from "@/features/editor/types"
import type { SaveInput, SaveResult } from "./types"

export type SaveStatus = "saved" | "dirty" | "saving" | "error" | "conflict"
export type RecoveryDraft = Snapshot & { baseRevision: number; savedAt: number }
export const draftKey = (id: string) => `digit:recovery:${id}`
export const createSaveQueue = (options: {
  id: string
  revision: number
  save: (input: SaveInput) => Promise<SaveResult>
  onStatus: (status: SaveStatus) => void
  onRevision?: (revision: number) => void
  writeDraft: (draft: RecoveryDraft | null) => void
  delay?: number
}) => {
  let revision = options.revision,
    pending: Snapshot | null = null,
    timer: ReturnType<typeof setTimeout> | undefined,
    inFlight = false,
    blocked = false,
    disposed = false
  const status = (value: SaveStatus) => {
    if (!disposed) options.onStatus(value)
  }
  const backup = () =>
    options.writeDraft(
      pending
        ? { ...pending, baseRevision: revision, savedAt: Date.now() }
        : null
    )
  const flush = async () => {
    clearTimeout(timer)
    if (disposed || blocked || inFlight || !pending) return
    const payload = pending
    pending = null
    inFlight = true
    status("saving")
    try {
      const result = await options.save({
        ...payload,
        id: options.id,
        expectedRevision: revision,
      })
      if (result.status === "conflict") {
        pending ??= payload
        blocked = true
        backup()
        status("conflict")
      } else {
        revision = result.revision
        options.onRevision?.(revision)
        backup()
        // Changes can arrive while the save promise is pending.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        status(pending ? "dirty" : "saved")
      }
    } catch {
      pending ??= payload
      backup()
      status("error")
      inFlight = false
      return
    }
    inFlight = false
    // Disposal can happen during the request.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (pending && !blocked && !disposed)
      timer = setTimeout(() => void flush(), options.delay ?? 1500)
  }
  const update = (snapshot: Snapshot) => {
    pending = snapshot
    backup()
    clearTimeout(timer)
    if (blocked) return
    if (!inFlight) status("dirty")
    timer = setTimeout(() => void flush(), options.delay ?? 1500)
  }
  return {
    update,
    flush,
    dispose: () => {
      disposed = true
      clearTimeout(timer)
    },
    get pending() {
      return pending !== null || inFlight
    },
  }
}
