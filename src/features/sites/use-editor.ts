import { useCallback, useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useOrpc } from "@/lib/use-orpc"
import type {
  SiteChange,
  SiteDocument,
  SiteRecord,
  SiteVersion,
  PendingSiteProposal,
} from "./schema"
import { applySiteProposal, applyTextEdit, applyVisualEdit } from "./source"
import { compileSite } from "./compile"

export const useSiteEditor = (initial: SiteRecord, canEdit: boolean) => {
  const [record, setRecord] = useState(initial),
    [history, setHistory] = useState<SiteVersion[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null)
  const current = useRef(record),
    locked = useRef(false),
    undoStack = useRef<string[]>([]),
    redoStack = useRef<string[]>([])
  current.current = record
  const queryClient = useQueryClient(),
    orpc = useOrpc(),
    { mutateAsync: save } = useMutation(orpc.sites.change.mutationOptions())
  const load = useCallback(
      () =>
        queryClient.fetchQuery(
          orpc.sites.get.queryOptions({
            input: { id: initial.id },
            staleTime: 0,
          })
        ),
      [initial.id, orpc.sites.get, queryClient]
    ),
    versions = useCallback(
      () =>
        queryClient.fetchQuery(
          orpc.sites.getHistory.queryOptions({
            input: { id: initial.id },
            staleTime: 0,
          })
        ),
      [initial.id, orpc.sites.getHistory, queryClient]
    ),
    readVersion = useCallback(
      (versionId: string) =>
        queryClient.fetchQuery(
          orpc.sites.getVersion.queryOptions({
            input: { id: initial.id, versionId },
            staleTime: 0,
          })
        ),
      [initial.id, orpc.sites.getVersion, queryClient]
    )
  const refreshHistory = useCallback(
    async () => setHistory(await versions()),
    [versions]
  )
  useEffect(() => {
    void refreshHistory().catch(() => setError("Historique indisponible."))
  }, [refreshHistory])
  useEffect(() => {
    let disposed = false
    let loading = false
    const refresh = async () => {
      if (locked.current || loading || document.visibilityState === "hidden")
        return
      loading = true
      const before = current.current
      try {
        const result = await load()
        // Le verrou peut changer pendant la requête réseau.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (disposed || locked.current || current.current !== before) return
        if (result.project && result.project.revision > before.revision) {
          current.current = result.project
          setRecord(result.project)
          undoStack.current = []
          redoStack.current = []
          await refreshHistory()
        }
      } catch {
        // Une erreur réseau temporaire sera retentée au prochain passage.
      } finally {
        loading = false
      }
    }
    const interval = window.setInterval(() => void refresh(), 1000)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      disposed = true
      window.clearInterval(interval)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [initial.id, load, refreshHistory])
  const commit = async (
    change: SiteChange,
    candidate: SiteDocument,
    summary?: string
  ) => {
    if (locked.current) throw new Error("Une modification est en cours.")
    if (!canEdit) throw new Error("Projet en lecture seule.")
    locked.current = true
    setBusy(true)
    setError(null)
    const before = current.current
    try {
      await compileSite(candidate)
      if (current.current !== before)
        throw new Error("Le projet a changé pendant la compilation.")
      const previous = await versions()
      const result = await save({
        id: initial.id,
        expectedRevision: before.revision,
        change,
      })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orpc.sites.get.queryKey({ input: { id: initial.id } }),
        }),
        queryClient.invalidateQueries({
          queryKey: orpc.mockups.list.queryKey(),
        }),
      ])
      current.current = result
      setRecord(result)
      if (summary !== "history") {
        const version = previous.find((v) => v.revision === before.revision)
        if (version) undoStack.current.push(version.id)
        redoStack.current = []
      }
      await refreshHistory()
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Modification impossible."
      setError(message)
      throw reason
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  const edit = async (
    change: Extract<SiteChange, { type: "text" | "visual" }>
  ) => {
    try {
      const candidate =
        change.type === "visual"
          ? applyVisualEdit(current.current.doc, change.edit)
          : applyTextEdit(current.current.doc, change.id, change.text)
      await commit(change, candidate)
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Modification impossible."
      )
    }
  }
  const restore = async (
    versionId: string,
    kind: "undo" | "redo" | "restore" = "restore"
  ) => {
    try {
      const candidate = await readVersion(versionId),
        latest = history.find((v) => v.revision === current.current.revision)
      await commit({ type: "restore", versionId }, candidate, "history")
      if (kind === "undo") {
        undoStack.current.pop()
        if (latest) redoStack.current.push(latest.id)
      } else if (kind === "redo") {
        redoStack.current.pop()
        if (latest) undoStack.current.push(latest.id)
      } else {
        if (latest) undoStack.current.push(latest.id)
        redoStack.current = []
      }
      setRecord({ ...current.current })
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Restauration impossible."
      )
    }
  }
  return {
    saveFile: async (path: string, content: string) => {
      await commit({type:"file",path,content},applySiteProposal(current.current.doc,{summary:`Modification de ${path}`,operations:[{type:"writeFile",path,content}]}))
    },
    record,
    history,
    busy,
    error,
    setError,
    edit,
    restore,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    undo: () => {
      const id = undoStack.current.at(-1)
      if (id) void restore(id, "undo")
    },
    redo: () => {
      const id = redoStack.current.at(-1)
      if (id) void restore(id, "redo")
    },
    reload: async () => {
      if (locked.current) return
      const result = await load()
      if (result.project) {
        setRecord(result.project)
        current.current = result.project
        undoStack.current = []
        redoStack.current = []
        setError(null)
        await refreshHistory()
      }
    },
    apply: async (proposal: PendingSiteProposal) => {
      if (proposal.baseRevision !== current.current.revision)
        throw new Error(
          "Le projet a changé pendant la génération. Demandez une nouvelle modification."
        )
      await commit(
        { type: "proposal", proposalId: proposal.id },
        applySiteProposal(current.current.doc, proposal.input)
      )
    },
  }
}
