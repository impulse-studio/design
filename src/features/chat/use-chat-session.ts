import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import {
  draftKey,
  chatReducer,
  initialChatState,
  isGenerating,
} from "./reducer"
import { chatStorageKey, restoreChat, serializeChat } from "./storage"
import { MAX_CHAT_FILES, validateChatFile } from "./attachments"
import type { ChatCallbacks, ChatContextItem, ChatScenario } from "./types"

export const useChatSession = (mockupId: string) => {
  const [state, dispatch] = useReducer(chatReducer, undefined, initialChatState)
  const [storageError, setStorageError] = useState(false)
  const snapshot = useRef(state)
  const urls = useRef(new Set<string>())
  const draft = state.drafts[draftKey(state)]

  useEffect(() => {
    try {
      dispatch({
        type: "hydrate",
        state: restoreChat(
          localStorage.getItem(chatStorageKey(mockupId)),
          localStorage.getItem(`digit:chat:${mockupId}`) ?? ""
        ),
      })
    } catch {
      dispatch({ type: "hydrate", state: initialChatState() })
      setStorageError(true)
    }
  }, [mockupId])

  useEffect(() => {
    snapshot.current = state
  }, [state])
  useEffect(() => {
    if (!state.ready) return
    const save = () => {
      try {
        localStorage.setItem(
          chatStorageKey(mockupId),
          serializeChat(snapshot.current)
        )
        setStorageError(false)
      } catch {
        setStorageError(true)
      }
    }
    const timer = window.setTimeout(save, 200)
    window.addEventListener("pagehide", save)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("pagehide", save)
    }
  }, [mockupId, state])

  useEffect(() => {
    const currentUrls = urls.current
    return () => {
      if (snapshot.current.ready) {
        try {
          localStorage.setItem(
            chatStorageKey(mockupId),
            serializeChat(snapshot.current)
          )
        } catch {
          /* In-memory chat remains available when storage is blocked. */
        }
      }
      currentUrls.forEach((url) => URL.revokeObjectURL(url))
      currentUrls.clear()
    }
  }, [mockupId])

  useEffect(() => {
    const live = new Set<string>()
    const collect = (items: typeof draft.attachments) =>
      items.forEach((item) => {
        if (item.blobUrl) live.add(item.blobUrl)
      })
    collect(state.drafts.demo.attachments)
    collect(state.drafts.disconnected.attachments)
    state.messages.forEach((message) => {
      collect(message.request?.attachments ?? [])
      message.blocks?.forEach((block) => {
        if (block.type === "attachments") collect(block.items)
      })
    })
    urls.current.forEach((url) => {
      if (!live.has(url)) {
        URL.revokeObjectURL(url)
        urls.current.delete(url)
      }
    })
  }, [state.drafts, state.messages])

  useEffect(() => {
    const run = state.run
    if (!run || !isGenerating(run)) return
    const timer = window.setTimeout(
      () =>
        dispatch({
          type: "tick",
          id: run.id,
          phase: run.phase,
          step: run.step,
        }),
      run.phase === "streaming" ? 35 : 650
    )
    return () => window.clearTimeout(timer)
  }, [state.run])

  const addFiles = useCallback((files: File[]) => {
    const current = snapshot.current
    if (!current.ready || current.run) return
    const items = [...current.drafts[draftKey(current)].attachments]
    const errors: string[] = []
    for (const file of files) {
      const error = validateChatFile(file)
      if (error) {
        errors.push(error)
        continue
      }
      if (items.length >= MAX_CHAT_FILES) {
        errors.push("Vous pouvez joindre cinq fichiers au maximum.")
        break
      }
      const blobUrl = URL.createObjectURL(file)
      urls.current.add(blobUrl)
      items.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        blobUrl,
      })
    }
    dispatch({ type: "attachments", items })
    dispatch({ type: "notice", text: errors.join(" ") || null })
  }, [])

  const send = (
    text: string,
    context: ChatContextItem[],
    scenario?: ChatScenario
  ) =>
    dispatch({ type: "send", id: crypto.randomUUID(), text, context, scenario })
  const callbacks: ChatCallbacks = {
    onAnswer: (id, answers, current) =>
      dispatch({ type: "answers", id, answers, current }),
    onSubmitAnswers: (id) => dispatch({ type: "submit-answers", id }),
    onApprove: (id) => dispatch({ type: "approve", id }),
    onReject: (id) => dispatch({ type: "reject", id }),
    onRequestChanges: (id) => dispatch({ type: "changes", id }),
    onToolDecision: (id, approved) => dispatch({ type: "tool", id, approved }),
    onRetry: (id) =>
      dispatch({ type: "retry", id, newId: crypto.randomUUID() }),
    onFeedback: (id, value) => dispatch({ type: "feedback", id, value }),
  }
  return { state, draft, dispatch, send, callbacks, addFiles, storageError }
}
export type ChatSession = ReturnType<typeof useChatSession>
