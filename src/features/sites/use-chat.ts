import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { aiRequest, hashDocument } from "@/features/ai/client"
import { createConversationSession } from "@/features/ai/conversation-session"
import type { AiConfiguration, AiSnapshot } from "@/features/ai/types"
import { useOrpc } from "@/server/use-orpc"
import type { SiteRecord, PendingSiteProposal } from "@/features/sites/types"

export const useSiteChat = (
  record: SiteRecord,
  selection: string | null,
  path: string,
  apply: (proposal: PendingSiteProposal) => Promise<void>,
  canEdit: boolean
) => {
  const queryClient = useQueryClient(),
    orpc = useOrpc()
  const [configuration, setConfiguration] = useState<AiConfiguration | null>(
      null
    ),
    [model, setModel] = useState(""),
    [snapshot, setSnapshot] = useState<AiSnapshot | null>(null),
    [error, setError] = useState<string | null>(null),
    [busy, setBusy] = useState(false)
  const current = useRef({ record, selection, path, apply }),
    processing = useRef(new Set<string>()),
    sending = useRef(false),
    session = useRef(
      createConversationSession({
        targetId: record.id,
        startRemoteSession: true,
      })
    )
  current.current = { record, selection, path, apply }
  useEffect(() => {
    void aiRequest<AiConfiguration>("configuration")
      .then((result) => {
        setConfiguration(result)
        setModel(
          (result.models.find((m) => m.isDefault) ?? result.models.at(0))
            ?.model ?? ""
        )
      })
      .catch(() => setError("Configuration IA indisponible."))
  }, [])
  useEffect(() => {
    let disposed = false,
      timer: ReturnType<typeof setTimeout>
    const refresh = async () => {
      try {
        const state = await aiRequest<AiSnapshot>(
          `state?mockupId=${encodeURIComponent(record.id)}`
        )
        if (disposed) return
        setSnapshot(state)
        if (canEdit) {
          const proposals = await queryClient.fetchQuery(
            orpc.sites.listPendingProposals.queryOptions({
              input: { id: record.id },
              staleTime: 0,
            })
          )
          for (const proposal of proposals) {
            if (processing.current.has(proposal.id)) continue
            processing.current.add(proposal.id)
            try {
              await current.current.apply(proposal)
            } catch (reason) {
              setError(
                reason instanceof Error
                  ? reason.message
                  : "La génération n’a pas pu être appliquée."
              )
            }
          }
        }
      } catch {
        if (!disposed)
          setError(
            "Connexion au chat interrompue. Nouvelle tentative automatique…"
          )
      } finally {
        if (!disposed) timer = setTimeout(() => void refresh(), 2000)
      }
    }
    void refresh()
    return () => {
      disposed = true
      clearTimeout(timer)
    }
  }, [record.id, canEdit, queryClient, orpc.sites.listPendingProposals])
  const send = async (prompt: string) => {
    if (sending.current || !canEdit) return false
    sending.current = true
    setBusy(true)
    setError(null)
    try {
      const state = current.current
      await session.current.send(
        {
          conversationId: snapshot?.conversationId,
          model,
          prompt,
          docHash: await hashDocument(state.record.doc),
          selectedIds: state.selection ? [state.selection] : [],
          activeRoute: state.path,
        },
        async ({ conversationId, runId }) => {
          const response = await fetch(
            `/api/ai/transport/in?chatId=${encodeURIComponent(conversationId)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                kind: "message",
                payload: {
                  chatId: conversationId,
                  trigger: "submit-message",
                  runId,
                  message: {
                    id: `${runId}:user`,
                    role: "user",
                    parts: [{ type: "text", text: prompt }],
                  },
                },
              }),
            }
          )
          if (!response.ok)
            throw new Error(
              "Le message n’a pas pu être transmis. Arrêtez la génération puis réessayez."
            )
        }
      )
      setSnapshot(
        await aiRequest<AiSnapshot>(
          `state?mockupId=${encodeURIComponent(record.id)}`
        )
      )
      return true
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Envoi impossible.")
      return false
    } finally {
      sending.current = false
      setBusy(false)
    }
  }
  return {
    configuration,
    model,
    setModel,
    snapshot,
    error,
    busy,
    send,
    running:
      snapshot?.run?.status === "queued" || snapshot?.run?.status === "running",
    stop: async () => {
      if (snapshot?.run) await session.current.stop(snapshot.run.id)
    },
  }
}
