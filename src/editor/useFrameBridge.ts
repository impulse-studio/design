import {
  type EditorMode,
  type FrameNode,
  MESSAGE_SOURCE,
  type RendererMessage,
  type ShellMessage,
} from "@digit-ai-studio/shared"
import { useEffect, useRef } from "react"

import { useEditorActions } from "./context"

/** Keeps one frame's iframe in sync with the document and collects the node boxes it reports. */
export function useFrameBridge(frame: FrameNode, mode: EditorMode) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const ready = useRef(false)
  const latest = useRef({ frame, mode })
  latest.current = { frame, mode }
  const { setFrameLayout } = useEditorActions()

  const send = (message: ShellMessage) =>
    iframeRef.current?.contentWindow?.postMessage({ source: MESSAGE_SOURCE.studio, ...message }, location.origin)

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== iframeRef.current?.contentWindow) return
      if (event.data?.source !== MESSAGE_SOURCE.renderer) return
      const message = event.data as RendererMessage
      if (message.type === "ready") {
        ready.current = true
        send({ type: "init", frame: latest.current.frame, mode: latest.current.mode })
      } else if (message.type === "rendered") {
        setFrameLayout(latest.current.frame.id, { rects: message.rects, contentHeight: message.contentHeight })
      } else if (message.type === "error") {
        console.warn(`[frame ${latest.current.frame.name}] ${message.nodeId}: ${message.message}`)
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [setFrameLayout])

  useEffect(() => {
    if (ready.current) send({ type: "replace", frame })
  }, [frame])

  useEffect(() => {
    if (ready.current) send({ type: "mode", mode })
  }, [mode])

  return iframeRef
}
