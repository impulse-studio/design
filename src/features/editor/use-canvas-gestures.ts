import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { useGesture } from "@use-gesture/react"
import { childLists, findNode } from "@digit-ai-studio/shared"
import type { GeometryPreview, Rect } from "@digit-ai-studio/shared"
import { useEditor } from "./context"
import { framesOf } from "./document"
import { bounds, hitTest, intersects, nodeRect } from "./geometry"
import { geometryIndex } from "./geometry-index"
import { isEditable, topSelected } from "./tree"
import {
  applyGeometryPatch,
  duplicateGestureDraft,
  snapCandidates,
  transformGesture,
} from "./gesture-transform"
import type { EditorState } from "./types"

type CanvasPointer = {
  clientX: number
  clientY: number
  button: number
  pointerId: number
  target: EventTarget | null
  currentTarget: EventTarget | null
  shiftKey?: boolean
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  preventDefault: () => void
  stopPropagation: () => void
}
type Gesture = {
  kind: "pan" | "move" | "marquee" | "frame" | "resize"
  start: { x: number; y: number }
  surfaceRect: DOMRect
  initial: EditorState
  ids: string[]
  rect: Rect | null
  handle?: string
  moved: boolean
  duplicate?: boolean
  cloned?: boolean
  scope?: string
  session: number
  candidates: Rect[]
  patches: GeometryPreview[]
}

export const useCanvasGestures = (
  surface: RefObject<HTMLDivElement | null>
) => {
  const editor = useEditor(),
    canvas = editor.canvas
  const [space, setSpace] = useState(false)
  const spaceRef = useRef(false),
    gesture = useRef<Gesture | null>(null)
  const mounted = useRef(false)
  const pending = useRef<CanvasPointer | null>(null),
    scheduled = useRef(0)
  const getState = (): EditorState => ({
    ...editor.state.get(),
    ...canvas.draft.get(),
    viewport: canvas.viewport.get(),
  })
  const local = (
    event: { clientX: number; clientY: number },
    rect = gesture.current?.surfaceRect ??
      surface.current?.getBoundingClientRect()
  ) => ({
    x: event.clientX - (rect?.x ?? 0),
    y: event.clientY - (rect?.y ?? 0),
  })
  const world = (point: { x: number; y: number }, state = getState()) => ({
    x: (point.x - state.viewport.x) / state.viewport.zoom,
    y: (point.y - state.viewport.y) / state.viewport.zoom,
  })
  const clearPending = () => {
    cancelAnimationFrame(scheduled.current)
    scheduled.current = 0
    pending.current = null
  }
  const cancel = () => {
    clearPending()
    const current = gesture.current
    gesture.current = null
    if (current?.kind === "pan") canvas.setViewport(current.initial.viewport)
    if (current) editor.cancel()
    canvas.reset()
  }
  const start = (
    kind: Gesture["kind"],
    event: CanvasPointer,
    state: EditorState,
    ids: string[] = [],
    handle?: string
  ) => {
    const surfaceRect = surface.current!.getBoundingClientRect()
    gesture.current = {
      kind,
      start: local(event, surfaceRect),
      surfaceRect,
      initial: state,
      ids,
      handle,
      rect: bounds(
        ids.flatMap((id) => {
          const r = geometryIndex(state).byId.get(id)?.rect
          return r ? [r] : []
        })
      ),
      moved: false,
      duplicate: event.altKey,
      session: canvas.nextSession(),
      patches: [],
      candidates: kind === "move" ? snapCandidates(state, ids) : [],
    }
    if (kind === "move" || kind === "resize") editor.begin()
  }
  const startResize = (event: CanvasPointer, handle: string) => {
    if (!surface.current) return
    const state = getState()
    if (
      state.rightTab === "inspect" ||
      state.mode === "preview" ||
      state.editingTextId
    )
      return
    event.preventDefault()
    const ids = topSelected(state.doc, state.selectedIds).filter((id) =>
      isEditable(state.doc, id)
    )
    if (ids.length) start("resize", event, state, ids, handle)
  }
  const down = (event: CanvasPointer) => {
    if (!surface.current) return
    if (event.button !== 0 && event.button !== 1) return
    const state = getState(),
      target = event.target instanceof Element ? event.target : null
    if (
      state.editingTextId ||
      state.mode === "preview" ||
      target?.closest("[data-canvas-control]")
    )
      return
    if (gesture.current) cancel()
    event.preventDefault()
    surface.current.focus({ preventScroll: true })
    const handle = target?.closest<HTMLElement>("[data-handle]")?.dataset.handle
    if (handle) {
      startResize(event, handle)
      return
    }
    const point = world(local(event))
    if (spaceRef.current || state.tool === "hand" || event.button === 1) {
      start("pan", event, state)
      return
    }
    if (state.rightTab === "design" && state.tool === "frame") {
      start("frame", event, state)
      return
    }
    if (
      state.rightTab === "design" &&
      (state.tool === "box" || state.tool === "text")
    ) {
      editor.insert(
        state.tool,
        hitTest(state, point, true) ?? undefined,
        undefined,
        point
      )
      return
    }
    const titleFrame = framesOf(state.doc).find(
      (frame) =>
        !frame.locked &&
        !frame.hidden &&
        point.x >= frame.x &&
        point.x <= frame.x + (nodeRect(state, frame)?.width ?? 1) &&
        point.y < frame.y &&
        point.y >= frame.y - 24 / state.viewport.zoom
    )
    const labelId =
      titleFrame?.id ??
      target?.closest<HTMLElement>("[data-frame-label]")?.dataset.frameLabel
    const id = labelId ?? hitTest(state, point, event.metaKey || event.ctrlKey)
    if (state.rightTab === "inspect") {
      editor.select(id, event.shiftKey)
      return
    }
    if (
      id &&
      !labelId &&
      geometryIndex(state).byId.get(id)?.node.type === "frame" &&
      !state.selectedIds.includes(id)
    ) {
      editor.select(id, event.shiftKey)
      start(
        "marquee",
        event,
        getState(),
        event.shiftKey ? state.selectedIds : []
      )
      gesture.current!.scope = id
    } else if (id) {
      if (event.shiftKey || !state.selectedIds.includes(id))
        editor.select(id, event.shiftKey)
      const next = getState(),
        ids = topSelected(next.doc, next.selectedIds).filter((value) =>
          isEditable(next.doc, value)
        )
      if (ids.length) start("move", event, next, ids)
    } else {
      if (!event.shiftKey) editor.select(null)
      start(
        "marquee",
        event,
        getState(),
        event.shiftKey ? state.selectedIds : []
      )
    }
  }
  const move = (event: CanvasPointer) => {
    if (!surface.current) return
    const state = getState(),
      current = gesture.current
    if (
      current &&
      (state.mode === "preview" ||
        (state.rightTab === "inspect" && current.kind !== "pan"))
    ) {
      cancel()
      return
    }
    const screen = local(event),
      point = world(screen)
    if (!current) {
      if (state.mode === "preview" || state.editingTextId) return
      const id = hitTest(state, point, event.metaKey || event.ctrlKey)
      if (id !== state.hoveredId) editor.set({ hoveredId: id })
      const index = geometryIndex(state),
        a = index.byId.get(state.selectedIds[0])?.rect,
        b = id ? index.byId.get(id)?.rect : null
      const measurement =
        event.altKey && a && b && state.selectedIds[0] !== id
          ? { from: a, to: b }
          : null
      if (measurement || canvas.visual.get().measurement)
        canvas.setVisual({ measurement })
      return
    }
    current.moved ||=
      Math.hypot(screen.x - current.start.x, screen.y - current.start.y) > 3
    if (current.kind === "pan") {
      canvas.setViewport({
        ...current.initial.viewport,
        x: current.initial.viewport.x + screen.x - current.start.x,
        y: current.initial.viewport.y + screen.y - current.start.y,
      })
      return
    }
    const origin = world(current.start, current.initial)
    if (current.kind === "marquee" || current.kind === "frame") {
      canvas.setVisual({
        marquee: {
          x: Math.min(origin.x, point.x),
          y: Math.min(origin.y, point.y),
          width: Math.abs(point.x - origin.x),
          height: Math.abs(point.y - origin.y),
        },
      })
      return
    }
    if (!current.moved || !current.rect) return
    if (current.kind === "move" && current.duplicate && !current.cloned) {
      const draft = duplicateGestureDraft(current.initial, current.ids)
      canvas.draft.setState(() => draft)
      current.ids = draft.selectedIds
      current.initial = { ...current.initial, ...draft }
      current.cloned = true
    }
    const result = transformGesture({
      initial: current.initial,
      ids: current.ids,
      rect: current.rect,
      kind: current.kind,
      handle: current.handle,
      dx: (screen.x - current.start.x) / current.initial.viewport.zoom,
      dy: (screen.y - current.start.y) / current.initial.viewport.zoom,
      shift: !!event.shiftKey,
      alt: !!event.altKey,
      session: current.session,
      candidates: current.candidates,
    })
    current.patches = result.patches
    canvas.setVisual({
      preview: result.preview,
      guides: result.guides,
      measurement: null,
    })
  }
  const up = (event: CanvasPointer) => {
    // The release position is authoritative, even if it arrives before the RAF.
    clearPending()
    if (!surface.current) {
      cancel()
      return
    }
    if (!gesture.current) return
    move(event)
    const current = gesture.current
    // move() can cancel the gesture if the editor mode changed.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!current) return
    gesture.current = null
    if (current.kind === "pan") {
      editor.setViewport(canvas.viewport.get())
      canvas.reset()
      return
    }
    const point = world(local(event, current.surfaceRect)),
      origin = world(current.start, current.initial)
    if (current.kind === "frame") {
      editor.begin()
      const id = editor.addFrame("desktop", {
        x: Math.min(origin.x, point.x),
        y: Math.min(origin.y, point.y),
      })
      if (current.moved && id)
        editor.updateNodes([id], (node) => {
          if (node.type === "frame") {
            node.width = Math.max(20, Math.round(Math.abs(point.x - origin.x)))
            node.height = Math.max(20, Math.round(Math.abs(point.y - origin.y)))
            delete node.preset
          }
        })
    }
    if (current.kind === "marquee" && current.moved) {
      const state = getState(),
        scope = current.scope ?? state.enteredId
      const r = {
        x: Math.min(origin.x, point.x),
        y: Math.min(origin.y, point.y),
        width: Math.abs(point.x - origin.x),
        height: Math.abs(point.y - origin.y),
      }
      const ids = geometryIndex(state)
        .entries.filter(
          (entry) =>
            !entry.hidden &&
            !entry.locked &&
            (scope
              ? entry.parent?.id === scope
              : entry.node.type === "frame") &&
            entry.rect &&
            intersects(r, entry.rect)
        )
        .map((entry) => entry.node.id)
      editor.set({ selectedIds: [...new Set([...current.ids, ...ids])] })
    }
    if (
      current.moved &&
      (current.kind === "move" || current.kind === "resize")
    ) {
      const draft = canvas.draft.get()
      if (draft) {
        editor.change((doc) => {
          doc.pages = draft.doc.pages
        })
        editor.set({ selectedIds: draft.selectedIds, layouts: draft.layouts })
      }
      const patches = new Map(
        current.patches.map((patch) => [patch.nodeId, patch])
      )
      editor.updateNodes(current.ids, (node) => {
        const patch = patches.get(node.id)
        if (patch) applyGeometryPatch(node, patch)
      })
      // Publish the final geometry once so selection/reparenting need not wait for an iframe.
      const preview = canvas.visual.get().preview
      if (preview) {
        const state = editor.state.get(),
          layouts = { ...state.layouts },
          index = geometryIndex(state)
        for (const [id, rect] of Object.entries(preview.rects)) {
          const entry = index.byId.get(id)
          if (!entry || entry.node.type === "frame") continue
          const layout = layouts[entry.frame.id]
          layouts[entry.frame.id] = {
            ...layout,
            contentHeight: layout?.contentHeight ?? 900,
            rects: {
              ...layout?.rects,
              [id]: {
                ...rect,
                x: rect.x - entry.frame.x,
                y: rect.y - entry.frame.y,
              },
            },
          }
        }
        editor.set({ layouts })
      }
      if (current.kind === "move") {
        const state = editor.state.get(),
          hit = hitTest(state, point, true, new Set(current.ids))
        const target = hit ? geometryIndex(state).byId.get(hit) : null
        if (target && !target.locked) {
          const parent =
            target.node.type === "box" || target.node.type === "frame"
              ? target.node
              : target.parent
          if (parent) {
            const list =
              childLists(parent).find((l) =>
                l.nodes.some((node) => node.id === hit)
              ) ?? childLists(parent).at(0)
            const row =
              (parent.type === "box" || parent.type === "frame") &&
              parent.autoLayout?.direction === "row"
            const index =
                list?.nodes.findIndex((node) => node.id === hit) ?? -1,
              r = target.rect
            editor.moveNodes(
              current.ids,
              parent.id,
              list?.key,
              index < 0
                ? Infinity
                : index +
                    (r &&
                    (row
                      ? point.x > r.x + r.width / 2
                      : point.y > r.y + r.height / 2)
                      ? 1
                      : 0)
            )
          }
        }
      }
    }
    editor.commit()
    canvas.reset()
  }
  const doubleClick = (event: { clientX: number; clientY: number }) => {
    if (!surface.current) return
    const state = getState()
    if (state.mode === "preview" || state.rightTab === "inspect") return
    const id = hitTest(state, world(local(event)), true)
    if (!id || !isEditable(state.doc, id)) return
    const node = findNode(framesOf(state.doc), id)!.node
    editor.select(id)
    editor.set({
      enteredId: id,
      editingTextId:
        node.type === "text" ||
        (node.type === "component" && node.text !== undefined)
          ? id
          : null,
    })
  }
  const queueMove = (event: CanvasPointer) => {
    if (!mounted.current || !surface.current) return
    pending.current = event
    if (!scheduled.current)
      scheduled.current = requestAnimationFrame(() => {
        scheduled.current = 0
        const next = pending.current
        pending.current = null
        if (next && mounted.current && surface.current) move(next)
      })
  }
  const ignored = (event: Event) =>
    !mounted.current ||
    !surface.current ||
    (event.target instanceof Element &&
      !!event.target.closest("[data-canvas-control]"))
  useGesture(
    {
      onDrag: ({ event, first, last, canceled }) => {
        if (!(event instanceof PointerEvent)) return
        if (
          canceled ||
          event.type === "pointercancel" ||
          event.type === "lostpointercapture"
        ) {
          cancel()
          return
        }
        if (first) down(event)
        else if (last) up(event)
        else if (gesture.current) queueMove(event)
      },
      onMove: ({ event, dragging }) => {
        if (!dragging && !gesture.current) queueMove(event)
      },
      onWheel: ({ event, delta: [dx, dy], last }) => {
        if (
          ignored(event) ||
          event.ctrlKey ||
          event.metaKey ||
          editor.state.get().editingTextId
        )
          return
        if (gesture.current && gesture.current.kind !== "pan") return
        event.preventDefault()
        const v = canvas.viewport.get()
        canvas.setViewport({
          ...v,
          x: v.x - (event.shiftKey && !dx ? dy : dx),
          y: v.y - (event.shiftKey && !dx ? 0 : dy),
        })
        if (last) editor.setViewport(canvas.viewport.get())
      },
      onPinch: ({ event, first, last, offset: [zoom], origin, memo }) => {
        if (ignored(event) || editor.state.get().editingTextId) return memo
        event.preventDefault()
        if (first) {
          if (gesture.current) cancel()
          const point = local({ clientX: origin[0], clientY: origin[1] })
          memo = world(point)
        }
        const anchor = memo as { x: number; y: number } | undefined
        if (!anchor) return memo
        const point = local({ clientX: origin[0], clientY: origin[1] })
        canvas.setViewport({
          x: point.x - anchor.x * zoom,
          y: point.y - anchor.y * zoom,
          zoom,
        })
        if (last) editor.setViewport(canvas.viewport.get())
        return memo
      },
    },
    {
      target: surface,
      eventOptions: { passive: false },
      drag: { threshold: 0, pointer: { buttons: [1, 4], keys: false } },
      pinch: {
        from: () => [canvas.viewport.get().zoom, 0],
        scaleBounds: { min: 0.05, max: 4 },
        rubberband: false,
        modifierKey: ["ctrlKey", "metaKey"],
      },
    }
  )
  // Native handlers and cancellation always use the newest render without rebinding listeners.
  const callbacks = useRef({ cancel, doubleClick })
  callbacks.current = { cancel, doubleClick }
  useEffect(() => {
    mounted.current = true
    canvas.registerCancel(() => callbacks.current.cancel())
    const element = surface.current
    const dblclick = (event: MouseEvent) => callbacks.current.doubleClick(event)
    const lost = () => {
      if (gesture.current) callbacks.current.cancel()
    }
    const key = (event: KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        event.key === "Escape" &&
        gesture.current
      ) {
        event.preventDefault()
        callbacks.current.cancel()
        editor.set({ tool: "move" })
        return
      }
      if (event.type === "keyup" && event.code === "Space") {
        spaceRef.current = false
        setSpace(false)
        return
      }
      if (
        event.code === "Space" &&
        !event.defaultPrevented &&
        !event.isComposing &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest(
            "input,textarea,select,button,[contenteditable=true],[role=slider],[role=tab],[role=menu],[role=dialog],[role=listbox]"
          )
        )
      ) {
        event.preventDefault()
        spaceRef.current = event.type === "keydown"
        setSpace(spaceRef.current)
      }
    }
    const blur = () => {
      spaceRef.current = false
      setSpace(false)
      lost()
      editor.setViewport(canvas.viewport.get())
    }
    element?.addEventListener("dblclick", dblclick)
    element?.addEventListener("lostpointercapture", lost)
    element?.addEventListener("pointercancel", lost)
    window.addEventListener("keydown", key)
    window.addEventListener("keyup", key)
    window.addEventListener("blur", blur)
    return () => {
      mounted.current = false
      callbacks.current.cancel()
      canvas.registerCancel(null)
      element?.removeEventListener("dblclick", dblclick)
      element?.removeEventListener("lostpointercapture", lost)
      element?.removeEventListener("pointercancel", lost)
      window.removeEventListener("keydown", key)
      window.removeEventListener("keyup", key)
      window.removeEventListener("blur", blur)
    }
  }, [editor, canvas, surface])
  return { down, move, up, doubleClick, startResize, space, world, cancel }
}
