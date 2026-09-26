import { useCallback, useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"
import type { SiteChange, SiteDocument } from "@/validators/sites/document"
import type { SiteRecord, SiteVersion } from "@/features/sites/types"
import { applySiteProposal, applyTextEdit, applyVisualEdit } from "./source"
import { syncSiteRuntime, validateSiteRuntime } from "./runtime"
import { createSiteEditingSession } from "./editing-session"

export const useSiteEditor = (initial: SiteRecord, canEdit: boolean) => {
  const [record, setRecord] = useState(initial),
    [history, setHistory] = useState<SiteVersion[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null)
  const session = useRef(createSiteEditingSession(initial)).current
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
      if (session.locked || loading || document.visibilityState === "hidden")
        return
      loading = true
      const token = session.readToken()
      try {
        const result = await load()
        if (disposed) return
        if (result.project && session.adoptRemote(token, result.project)) {
          setRecord(result.project)
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
    const before = session.beginWrite(canEdit)
    setBusy(true)
    setError(null)
    try {
      await validateSiteRuntime(candidate)
      if (session.record !== before)
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
      const version = previous.find((v) => v.revision === before.revision)
      if (summary === "history") session.completeHistoricalWrite(result)
      else session.completeWrite(result, version?.id)
      setRecord(result)
      await refreshHistory()
    } catch (reason) {
      void syncSiteRuntime(before.doc).catch(() => undefined)
      const message =
        reason instanceof Error ? reason.message : "Modification impossible."
      setError(message)
      throw reason
    } finally {
      if (session.locked) session.abortWrite()
      setBusy(false)
    }
  }
  const edit = async (
    change: Extract<SiteChange, { type: "text" | "visual" }>
  ) => {
    try {
      const candidate =
        change.type === "visual"
          ? applyVisualEdit(session.record.doc, change.edit)
          : applyTextEdit(session.record.doc, change.id, change.text)
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
        latest = history.find((v) => v.revision === session.record.revision)
      await commit({ type: "restore", versionId }, candidate, "history")
      session.completeRestore(session.record, kind, latest?.id)
      setRecord({ ...session.record })
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Restauration impossible."
      )
    }
  }
  return {
    saveFile: async (path: string, content: string) => {
      await commit(
        { type: "file", path, content },
        applySiteProposal(session.record.doc, {
          summary: `Modification de ${path}`,
          operations: [{ type: "writeFile", path, content }],
        })
      )
    },
    record,
    history,
    busy,
    error,
    setError,
    edit,
    restore,
    canUndo: session.canUndo,
    canRedo: session.canRedo,
    undo: () => {
      const id = session.historyTarget("undo")
      if (id) void restore(id, "undo")
    },
    redo: () => {
      const id = session.historyTarget("redo")
      if (id) void restore(id, "redo")
    },
    reload: async () => {
      if (session.locked) return
      const token = session.readToken()
      const result = await load()
      if (result.project && session.reload(token, result.project)) {
        setRecord(result.project)
        setError(null)
        await refreshHistory()
      }
    },
  }
}
