import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { findNode, rendererMessageSchema } from "@digit-ai-studio/shared"
import type {
  FrameNode,
  GeometryPreview,
  ShellMessage,
} from "@digit-ai-studio/shared"
import { useEditor, useEditorState } from "./context"
import { framesOf } from "./document"

const shellOnly = new Set(["x", "y", "name", "locked", "hidden"])
export const sameFrameContent = (a: FrameNode, b: FrameNode) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].every(
    (key) =>
      shellOnly.has(key) ||
      a[key as keyof FrameNode] === b[key as keyof FrameNode]
  )
}

export const useFrameRenderer = (
  frame: FrameNode,
  iframe: RefObject<HTMLIFrameElement | null>
) => {
  const editor = useEditor(),
    latest = useRef(frame),
    revision = useRef(0),
    lastSent = useRef<FrameNode | null>(null)
  const [ready, setReady] = useState(false)
  const mode = useEditorState((s) => s.mode),
    editing = useEditorState((s) => s.editingTextId),
    detachRequest = useEditorState((s) => s.detachRequest)
  const previewState = useRef({
    session: 0,
    sequence: 0,
    patches: null as GeometryPreview[] | null,
  })
  latest.current = frame
  const send = (message: ShellMessage) =>
    iframe.current?.contentWindow?.postMessage(message, location.origin)
  const initialize = () => {
    revision.current++
    lastSent.current = latest.current
    previewState.current = { session: 0, sequence: 0, patches: null }
    send({
      source: "digit-studio",
      type: "init",
      frameId: frame.id,
      revision: revision.current,
      frame: latest.current,
      mode: editor.state.get().mode,
      theme: latest.current.theme ?? "light",
    })
  }
  const callbacks = useRef({ initialize, send })
  callbacks.current = { initialize, send }
  useEffect(() => {
    let scheduled = 0
    const sendPreview = () => {
      scheduled = 0
      if (!lastSent.current) return
      const preview = editor.canvas.visual.get().preview,
        patches = preview?.frames[frame.id] ?? null,
        previous = previewState.current
      if (
        patches === previous.patches &&
        (preview?.session ?? previous.session) === previous.session
      )
        return
      if (!patches && !previous.patches) return
      const session = preview?.session ?? previous.session,
        sequence = previous.sequence + 1
      previewState.current = { session, sequence, patches }
      callbacks.current.send({
        source: "digit-studio",
        type: "geometry-preview",
        frameId: frame.id,
        revision: revision.current,
        session,
        sequence,
        patches: patches ?? [],
      })
    }
    const schedulePreview = () => {
      if (!scheduled) scheduled = requestAnimationFrame(sendPreview)
    }
    const unsubscribe = editor.canvas.visual.on("change", schedulePreview)
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== iframe.current?.contentWindow
      )
        return
      const parsed = rendererMessageSchema.safeParse(event.data)
      if (!parsed.success || parsed.data.frameId !== frame.id) return
      const message = parsed.data
      if (message.type === "ready") {
        callbacks.current.initialize()
        schedulePreview()
        return
      }
      if (message.revision !== revision.current) return
      if (message.type === "exitPreview") {
        editor.set({ mode: "edit" })
        iframe.current.blur()
        window.focus()
      }
      if (message.type === "rendered") {
        setReady(true)
        if (message.previewSession !== undefined) {
          const current = editor.canvas.visual.get().preview
          if (
            !current ||
            current.session !== message.previewSession ||
            message.previewSequence !== previewState.current.sequence
          )
            return
          if (current.frames[frame.id] !== previewState.current.patches) return
          // Auto-layout can change a hug frame's extent while a child resizes.
          // Keep this measurement transient; it must not rerender the inspector.
          const sizes = editor.canvas.visual.get().frameSizes
          if (
            sizes[frame.id]?.width !== message.contentWidth ||
            sizes[frame.id]?.height !== message.contentHeight
          )
            editor.canvas.setVisual({
              frameSizes: {
                ...sizes,
                [frame.id]: {
                  width: message.contentWidth,
                  height: message.contentHeight,
                },
              },
            })
          return
        }
        // A full measurement produced before the preview must not overwrite an active gesture.
        if (editor.canvas.visual.get().preview?.frames[frame.id]) return
        const next = {
          rects: message.rects,
          computed: message.computed,
          contentWidth: message.contentWidth,
          contentHeight: message.contentHeight,
        }
        const previous = editor.state.get().layouts[frame.id]
        if (JSON.stringify(previous) !== JSON.stringify(next))
          editor.set({
            layouts: { ...editor.state.get().layouts, [frame.id]: next },
          })
      }
      if (message.type === "textCommit") {
        editor.updateNodes([message.nodeId], (node) => {
          if (node.type === "text") node.content = message.value
          if (node.type === "component" && node.text !== undefined)
            node.text = message.value
        })
        editor.set({ editingTextId: null })
      }
      if (message.type === "detached")
        editor.detachComponent(message.nodeId, message.snapshot, message.requestId)
      if (message.type === "error")
        editor.set({
          notice: message.message,
          ...(editor.state.get().detachRequest?.nodeId === message.nodeId
            ? { detachRequest: null }
            : {}),
        })
    }
    window.addEventListener("message", receive)
    return () => {
      window.removeEventListener("message", receive)
      unsubscribe()
      cancelAnimationFrame(scheduled)
    }
  }, [editor, frame.id, iframe])
  useEffect(() => {
    if (!detachRequest || detachRequest.frameId !== frame.id || !lastSent.current)
      return
    send({
      source: "digit-studio",
      type: "detach-component",
      frameId: frame.id,
      revision: revision.current,
      nodeId: detachRequest.nodeId,
      requestId: detachRequest.requestId,
    })
  }, [detachRequest, frame.id])
  useLayoutEffect(() => {
    if (!lastSent.current || sameFrameContent(lastSent.current, frame)) return
    revision.current++
    lastSent.current = frame
    previewState.current = { session: 0, sequence: 0, patches: null }
    send({
      source: "digit-studio",
      type: "replace",
      frameId: frame.id,
      revision: revision.current,
      frame,
    })
  }, [frame])
  useEffect(() => {
    if (!lastSent.current) return
    send({
      source: "digit-studio",
      type: "mode",
      frameId: frame.id,
      revision: revision.current,
      mode,
    })
  }, [mode, frame.id])
  useEffect(() => {
    if (
      editing &&
      findNode(framesOf(editor.state.get().doc), editing)?.frame.id === frame.id
    )
      send({
        source: "digit-studio",
        type: "edit-text",
        frameId: frame.id,
        revision: revision.current,
        nodeId: editing,
      })
  }, [editing, frame.id, editor])
  return { ready, initialize, mode }
}
