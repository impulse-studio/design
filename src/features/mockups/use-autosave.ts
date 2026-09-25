import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { documentSchema } from "@digit-ai-studio/shared"
import type { Editor } from "@/features/editor/store"
import { useOrpc } from "@/server/use-orpc"
import { createSaveQueue, draftKey } from "./save-queue"
import type { RecoveryDraft, SaveStatus } from "./save-queue"
import type { MockupRecord } from "./types"

import { mockupStatusSchema } from "@/validators/mockups"

export const useAutosave = (editor: Editor, initial: MockupRecord) => {
  const orpc = useOrpc(),
    queryClient = useQueryClient()
  const { mutateAsync: save } = useMutation(orpc.mockups.save.mutationOptions())
  const [status, setStatus] = useState<SaveStatus>("saved")
  const [revision, setRevision] = useState(initial.revision)
  const revisionRef = useRef(initial.revision)
  const [recovery, setRecovery] = useState<RecoveryDraft | null>(null)
  const queue = useRef<ReturnType<typeof createSaveQueue> | null>(null)
  const recoveryRef = useRef(false)
  useEffect(() => {
    if (editor.readOnly) return
    const key = draftKey(initial.id)
    try {
      const candidate: unknown = JSON.parse(localStorage.getItem(key) ?? "null")
      if (
        candidate &&
        typeof candidate === "object" &&
        "doc" in candidate &&
        "name" in candidate &&
        "baseRevision" in candidate &&
        "savedAt" in candidate &&
        typeof candidate.name === "string" &&
        typeof candidate.baseRevision === "number" &&
        typeof candidate.savedAt === "number"
      ) {
        const recoveredStatus = mockupStatusSchema
          .catch("draft")
          .parse("status" in candidate ? candidate.status : initial.status)
        const parsed = documentSchema.safeParse(candidate.doc)
        if (
          parsed.success &&
          JSON.stringify({
            doc: parsed.data,
            name: candidate.name,
            status: recoveredStatus,
          }) !==
            JSON.stringify({
              doc: initial.doc,
              name: initial.name,
              status: initial.status,
            })
        ) {
          setRecovery({
            doc: parsed.data,
            name: candidate.name,
            status: recoveredStatus,
            baseRevision: candidate.baseRevision,
            savedAt: candidate.savedAt,
          })
          recoveryRef.current = true
        }
      }
    } catch {
      /* A malformed browser draft never replaces the server document. */
    }
    const current = createSaveQueue({
      id: initial.id,
      revision: initial.revision,
      save: async (data) => {
        const result = await save(data)
        if (result.status === "saved")
          await queryClient.invalidateQueries({
            queryKey: orpc.mockups.list.queryKey(),
          })
        return result
      },
      onStatus: setStatus,
      onRevision: (value) => {
        revisionRef.current = value
        setRevision(value)
      },
      writeDraft: (value) => {
        try {
          if (value) localStorage.setItem(key, JSON.stringify(value))
          else localStorage.removeItem(key)
        } catch {
          /* Database persistence remains available when browser storage is full. */
        }
      },
    })
    queue.current = current
    let previousDoc = initial.doc,
      previousName = initial.name,
      previousStatus = initial.status
    const subscription = editor.state.subscribe((state) => {
      if (state.transaction || recoveryRef.current) return
      if (
        state.doc !== previousDoc ||
        state.name !== previousName ||
        state.status !== previousStatus
      ) {
        previousDoc = state.doc
        previousName = state.name
        previousStatus = state.status
        current.update({
          doc: state.doc,
          name: state.name,
          status: state.status,
        })
      }
    })
    const leaving = (event: BeforeUnloadEvent) => {
      const state = editor.state.get()
      if (
        !recoveryRef.current &&
        (state.doc !== previousDoc ||
          state.name !== previousName ||
          state.status !== previousStatus)
      )
        current.update({
          doc: state.doc,
          name: state.name,
          status: state.status,
        })
      if (current.pending || recoveryRef.current) {
        event.preventDefault()
      }
    }
    window.addEventListener("beforeunload", leaving)
    return () => {
      subscription.unsubscribe()
      current.dispose()
      window.removeEventListener("beforeunload", leaving)
    }
  }, [
    editor,
    initial.id,
    initial.revision,
    initial.doc,
    initial.name,
    initial.status,
    // Nested ORPC utilities are proxies recreated on access. Depending on one
    // restarts this effect on every render, rereads recovery drafts and loses
    // pending saves. The root utility object is stable for the router lifetime.
    orpc,
    queryClient,
    save,
  ])
  const recover = () => {
    if (!recovery) return
    recoveryRef.current = false
    editor.setEditorMode("design")
    editor.begin()
    editor.replace(recovery.doc)
    editor.rename(recovery.name)
    editor.set({ status: recovery.status })
    editor.commit()
    setRecovery(null)
  }
  const discard = () => {
    recoveryRef.current = false
    setRecovery(null)
    try {
      localStorage.removeItem(draftKey(initial.id))
    } catch {
      /* Storage can be unavailable. */
    }
    const state = editor.state.get()
    if (
      state.doc !== initial.doc ||
      state.name !== initial.name ||
      state.status !== initial.status
    )
      queue.current?.update({
        doc: state.doc,
        name: state.name,
        status: state.status,
      })
  }
  return {
    status,
    revision,
    getRevision: () => revisionRef.current,
    isClean: () =>
      !queue.current?.pending &&
      !recoveryRef.current &&
      !editor.state.get().transaction,
    recovery,
    recover,
    discard,
    retry: () => void queue.current?.flush(),
    waitForSave: async () => {
      if (editor.state.get().transaction || recoveryRef.current)
        throw new Error(
          "Terminez l’édition ou récupérez le brouillon avant de continuer."
        )
      if (editor.readOnly) return
      const current = queue.current
      if (!current) throw new Error("La sauvegarde n’est pas encore prête.")
      await current.flush()
      const deadline = Date.now() + 8000
      while (current.pending && Date.now() < deadline)
        await new Promise<void>((resolve) => setTimeout(resolve, 100))
      if (current.pending)
        throw new Error(
          "La sauvegarde est en attente. Résolvez l’erreur ou le conflit avant de continuer."
        )
    },
  }
}
