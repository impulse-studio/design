import { useCallback, useEffect, useRef, useState } from "react"
import { Chat, useChat } from "@ai-sdk/react"
import { useTriggerChatTransport } from "@trigger.dev/sdk/chat/react"
import type { UIMessage } from "ai"
import type { MockupDoc } from "@digit-ai-studio/shared"
import { useEditor } from "@/features/editor/context"
import { useEditorPersistence } from "@/features/mockups/persistence-context"
import type { AiProposal, AiSnapshot, AiConfiguration } from "./types"
import { aiRequest, hashDocument } from "./client"

const empty: AiSnapshot = {
  sessionStarted: false,
  uiMessages: [],
  usage: [],
  conversations: [],
  conversationId: null,
  messages: [],
  proposals: [],
  run: null,
}
export const useAiChat = (mockupId: string) => {
  const editor = useEditor(),
    persistence = useEditorPersistence()
  const [snapshot, setSnapshot] = useState<AiSnapshot>(empty)
  const [connection, setConnection] = useState<AiConfiguration | null>(null)
  const [conversationId, setConversationId] = useState<string>()
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [ignored, setIgnored] = useState<string[]>([])
  const [pendingApply, setPendingApply] = useState<string | null>(null)
  const submission = useRef<{ key: string; requestId: string } | null>(null)
  const connectionRequest = useRef(0)
  const locked = useRef(false)
  const transport = useTriggerChatTransport({
    task: "studio-chat",
    accessToken: () => "studio-session",
    startSession: ({ chatId }) =>
      aiRequest("action", { action: "session", conversationId: chatId }),
    fetch: (url, init, { endpoint, chatId }) => {
      const upstream = new URL(url)
      const query = new URLSearchParams(upstream.search)
      query.set("chatId", chatId)
      const headers = new Headers(init.headers)
      headers.delete("authorization")
      // Native stop chunks are redundant: our typed stop action updates the DB first.
      if (
        endpoint === "in" &&
        typeof init.body === "string" &&
        JSON.parse(init.body).kind === "stop"
      )
        return Promise.resolve(Response.json({}))
      return fetch(`/api/ai/transport/${endpoint}?${query}`, {
        ...init,
        headers,
        credentials: "same-origin",
      })
    },
  })
  const chats = useRef(new Map<string, Chat<UIMessage>>())
  const getChat = useCallback(
    (id: string) => {
      let value = chats.current.get(id)
      if (!value) {
        value = new Chat<UIMessage>({ id, transport })
        chats.current.set(id, value)
      }
      return value
    },
    [transport]
  )
  const [activeChat, setActiveChat] = useState(() =>
    getChat(`empty-${mockupId}`)
  )
  const live = useChat({ chat: activeChat })
  useEffect(() => {
    const id = snapshot.conversationId
    if (!id) return
    const value = getChat(id)
    setActiveChat(value)
    if (!transport.getSession(id) && snapshot.sessionStarted) {
      value.messages = snapshot.uiMessages
      transport.setSession(id, {
        publicAccessToken: "studio-session",
        lastEventId: snapshot.lastEventId,
        isStreaming:
          snapshot.run?.status === "running" ||
          snapshot.run?.status === "queued",
      })
      if (
        snapshot.run?.status === "running" ||
        snapshot.run?.status === "queued"
      )
        void value.resumeStream().catch(() => undefined)
    }
  }, [
    snapshot.sessionStarted,
    snapshot.conversationId,
    snapshot.uiMessages,
    snapshot.lastEventId,
    snapshot.run?.status,
    getChat,
    transport,
  ])
  const query = `mockupId=${encodeURIComponent(mockupId)}${conversationId ? `&conversationId=${encodeURIComponent(conversationId)}` : ""}`
  const refresh = useCallback(async () => {
    setSnapshot(await aiRequest<AiSnapshot>(`state?${query}`))
  }, [query])
  const refreshConnection = useCallback(async () => {
    const sequence = ++connectionRequest.current
    const result = await aiRequest<AiConfiguration>("configuration")
    if (sequence !== connectionRequest.current) return result
    setConnection(result)
    setModel((previous) =>
      result.models.some((item) => item.model === previous)
        ? previous
        : ((result.models.find((item) => item.isDefault) ?? result.models.at(0))
            ?.model ?? "")
    )
    return result
  }, [])
  useEffect(() => {
    void refreshConnection().catch((reason: unknown) =>
      setError(
        reason instanceof Error ? reason.message : "Connexion indisponible."
      )
    )
  }, [refreshConnection])
  useEffect(() => {
    let receivedSnapshot = false
    const events = new EventSource(`/api/ai/events?${query}`)
    events.addEventListener("snapshot", (event: MessageEvent<string>) => {
      receivedSnapshot = true
      setSnapshot(JSON.parse(event.data) as AiSnapshot)
      setReconnecting(false)
    })
    events.addEventListener("unavailable", () => {
      events.close()
      setSnapshot(empty)
      setError("Votre accès au chat a changé. Rechargez le studio.")
    })
    events.onerror = () => setReconnecting(true)
    const controller = new AbortController()
    void aiRequest<AiSnapshot>(`state?${query}`, undefined, controller.signal)
      .then((result) => {
        if (!receivedSnapshot && !controller.signal.aborted) setSnapshot(result)
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error ? reason.message : "Chat indisponible."
          )
      })
    return () => {
      events.close()
      controller.abort()
    }
  }, [query])
  const perform = async (action: () => Promise<void>) => {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "La demande a échoué."
      )
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  const newConversation = () =>
    perform(async () => {
      const result = await aiRequest<{ id: string }>("action", {
        action: "conversation",
        mockupId,
      })
      setConversationId(result.id)
      setSnapshot({
        ...empty,
        conversations: snapshot.conversations,
        conversationId: result.id,
      })
      submission.current = null
    })
  const send = (text: string) =>
    perform(async () => {
      await persistence.waitForSave()
      const state = editor.state.get()
      const docHash = await hashDocument(state.doc)
      const selectedIds = state.selectedIds.filter(
        (id) => !ignored.includes(id)
      )
      let id = conversationId ?? snapshot.conversationId
      if (!id) {
        id = (
          await aiRequest<{ id: string }>("action", {
            action: "conversation",
            mockupId,
          })
        ).id
        setConversationId(id)
      }
      const key = JSON.stringify([id, text, model, docHash, selectedIds])
      if (submission.current?.key !== key)
        submission.current = { key, requestId: crypto.randomUUID() }
      const admitted = await aiRequest<{ id: string }>("action", {
        action: "send",
        conversationId: id,
        requestId: submission.current.requestId,
        model,
        prompt: text,
        docHash,
        selectedIds,
      })
      const conversationChat = getChat(id)
      setActiveChat(conversationChat)
      void conversationChat
        .sendMessage(
          {
            id: `${admitted.id}:user`,
            role: "user",
            parts: [{ type: "text", text }],
          },
          { body: { runId: admitted.id } }
        )
        .catch(() =>
          setError(
            "Le flux a été interrompu. La réponse partielle est conservée."
          )
        )
      setDraft("")
      submission.current = null
      setConversationId(id)
      setSnapshot(
        await aiRequest<AiSnapshot>(
          `state?mockupId=${encodeURIComponent(mockupId)}&conversationId=${encodeURIComponent(id)}`
        )
      )
    })
  const apply = (proposal: AiProposal) =>
    perform(async () => {
      if (editor.readOnly || editor.state.get().rightTab === "inspect")
        throw new Error("Passez en édition pour appliquer cette proposition.")
      await persistence.waitForSave()
      if (pendingApply === proposal.id) {
        await aiRequest("action", {
          action: "decide",
          proposalId: proposal.id,
          decision: "applied",
        })
      } else {
        const before = editor.state.get().doc
        const docHash = await hashDocument(before)
        const result = await aiRequest<{
          doc: MockupDoc
          baseHash: string
          alreadyApplied: boolean
        }>("action", { action: "prepare", proposalId: proposal.id, docHash })
        if (
          editor.state.get().doc !== before ||
          editor.state.get().transaction ||
          editor.state.get().rightTab === "inspect"
        )
          throw new Error(
            "La maquette a changé. Demandez une nouvelle proposition."
          )
        if (!result.alreadyApplied) editor.replace(result.doc)
        setPendingApply(proposal.id)
        await persistence.waitForSave()
        await aiRequest("action", {
          action: "decide",
          proposalId: proposal.id,
          decision: "applied",
        })
      }
      setPendingApply(null)
      await refresh()
    })
  return {
    snapshot: {
      ...snapshot,
      messages: snapshot.messages.map((message) => {
        if (
          live.status !== "streaming" ||
          activeChat.id !== snapshot.conversationId ||
          message.id !== `${snapshot.run?.id}:assistant`
        )
          return message
        const assistant = [...live.messages]
          .reverse()
          .find((item) => item.role === "assistant")
        const text = assistant?.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("")
        return text ? { ...message, text } : message
      }),
    },
    connection,
    draft,
    model,
    error:
      error ??
      (live.error
        ? "Le flux IA a été interrompu. La réponse partielle est conservée ; vous pouvez arrêter puis réessayer."
        : null),
    busy,
    reconnecting,
    ignored,
    pendingApply,
    setDraft,
    setModel,
    setConversationId,
    setIgnored,
    newConversation,
    send,
    apply,
    clearError: () => setError(null),
    refreshConnection: () =>
      perform(async () => {
        await refreshConnection()
      }),
    stop: () =>
      perform(async () => {
        if (snapshot.run)
          await aiRequest("action", { action: "stop", runId: snapshot.run.id })
        await activeChat.stop()
        await refresh()
      }),
    reject: (proposal: AiProposal) =>
      perform(async () => {
        await aiRequest("action", {
          action: "decide",
          proposalId: proposal.id,
          decision: "rejected",
        })
        await refresh()
      }),
  }
}
