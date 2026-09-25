import type { SiteRecord } from "@/features/sites/types"

export type SiteReadToken = {
  record: SiteRecord
  generation: number
}

export const createSiteEditingSession = (initial: SiteRecord) => {
  let current = initial
  let generation = 0
  let writing = false
  const undo: string[] = []
  const redo: string[] = []

  const resetHistory = () => {
    undo.length = 0
    redo.length = 0
  }

  return {
    get record() {
      return current
    },
    get locked() {
      return writing
    },
    get canUndo() {
      return undo.length > 0
    },
    get canRedo() {
      return redo.length > 0
    },
    readToken: (): SiteReadToken => ({ record: current, generation }),
    adoptRemote: (token: SiteReadToken, next: SiteRecord) => {
      if (
        writing ||
        generation !== token.generation ||
        current !== token.record ||
        next.revision <= current.revision
      )
        return false
      current = next
      generation++
      resetHistory()
      return true
    },
    reload: (token: SiteReadToken, next: SiteRecord) => {
      if (
        writing ||
        generation !== token.generation ||
        current !== token.record
      )
        return false
      current = next
      generation++
      resetHistory()
      return true
    },
    beginWrite: (canEdit: boolean) => {
      if (writing) throw new Error("Une modification est en cours.")
      if (!canEdit) throw new Error("Projet en lecture seule.")
      writing = true
      generation++
      return current
    },
    completeWrite: (next: SiteRecord, previousVersionId?: string) => {
      current = next
      writing = false
      generation++
      if (previousVersionId) undo.push(previousVersionId)
      redo.length = 0
    },
    completeHistoricalWrite: (next: SiteRecord) => {
      current = next
      writing = false
      generation++
    },
    abortWrite: () => {
      writing = false
      generation++
    },
    historyTarget: (kind: "undo" | "redo") =>
      (kind === "undo" ? undo : redo).at(-1),
    completeRestore: (
      next: SiteRecord,
      kind: "undo" | "redo" | "restore",
      previousVersionId?: string
    ) => {
      current = next
      writing = false
      generation++
      if (kind === "undo") {
        undo.pop()
        if (previousVersionId) redo.push(previousVersionId)
      } else if (kind === "redo") {
        redo.pop()
        if (previousVersionId) undo.push(previousVersionId)
      } else {
        if (previousVersionId) undo.push(previousVersionId)
        redo.length = 0
      }
    },
  }
}
