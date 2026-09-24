import { type AnyNode, findNode, type MockupDoc, type Rect, walk } from "@digit-ai-studio/shared"
import { createStore } from "@tanstack/react-store"
import { type Draft, produce } from "immer"

import { HISTORY_LIMIT, type Tool, ZOOM } from "./constants"

export type Viewport = { x: number; y: number; zoom: number }
export type Point = { x: number; y: number }

export type FrameLayout = { rects: Record<string, Rect>; contentHeight: number }

export type EditorState = {
  doc: MockupDoc
  selectedIds: string[]
  hoveredId: string | null
  viewport: Viewport
  tool: Tool
  /** Node boxes reported by each frame's renderer, in frame coordinates. */
  layouts: Record<string, FrameLayout>
  past: MockupDoc[]
  future: MockupDoc[]
}

const clampZoom = (zoom: number) => Math.min(ZOOM.max, Math.max(ZOOM.min, zoom))

export function createEditorStore(doc: MockupDoc) {
  return createStore<EditorState, ReturnType<typeof editorActions>>(
    {
      doc,
      selectedIds: [],
      hoveredId: null,
      viewport: { x: 0, y: 0, zoom: 0.5 },
      tool: "move",
      layouts: {},
      past: [],
      future: [],
    },
    editorActions,
  )
}

type SetState = (updater: (prev: EditorState) => EditorState) => void

function editorActions({ setState, get }: { setState: SetState; get: () => EditorState }) {
  /** Every document change goes through here so it lands in the undo history. */
  const updateDoc = (recipe: (doc: Draft<MockupDoc>) => void) =>
    setState((s) => {
      const next = produce(s.doc, recipe)
      if (next === s.doc) return s
      return { ...s, doc: next, past: [...s.past, s.doc].slice(-HISTORY_LIMIT), future: [] }
    })

  const updateNode = (id: string, recipe: (node: Draft<AnyNode>) => void) =>
    updateDoc((doc) => {
      const location = findNode(doc.frames as MockupDoc["frames"], id)
      if (location) recipe(location.node as Draft<AnyNode>)
    })

  return {
    updateDoc,
    updateNode,

    select: (id: string | null, additive = false) =>
      setState((s) => {
        if (id === null) return { ...s, selectedIds: [] }
        if (!additive) return { ...s, selectedIds: [id] }
        const has = s.selectedIds.includes(id)
        return { ...s, selectedIds: has ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id] }
      }),

    hover: (id: string | null) => setState((s) => (s.hoveredId === id ? s : { ...s, hoveredId: id })),

    setTool: (tool: Tool) => setState((s) => ({ ...s, tool })),

    setFrameLayout: (frameId: string, layout: FrameLayout) =>
      setState((s) => ({ ...s, layouts: { ...s.layouts, [frameId]: layout } })),

    panBy: (dx: number, dy: number) =>
      setState((s) => ({ ...s, viewport: { ...s.viewport, x: s.viewport.x + dx, y: s.viewport.y + dy } })),

    /** Zooms keeping the canvas point under `screen` fixed. */
    zoomAt: (screen: Point, factor: number) =>
      setState((s) => {
        const zoom = clampZoom(s.viewport.zoom * factor)
        const ratio = zoom / s.viewport.zoom
        return {
          ...s,
          viewport: { zoom, x: screen.x - (screen.x - s.viewport.x) * ratio, y: screen.y - (screen.y - s.viewport.y) * ratio },
        }
      }),

    setViewport: (viewport: Viewport) => setState((s) => ({ ...s, viewport: { ...viewport, zoom: clampZoom(viewport.zoom) } })),

    deleteSelection: () => {
      const { selectedIds } = get()
      updateDoc((doc) => {
        const remove = (nodes: { id: string }[]) => {
          for (let i = nodes.length - 1; i >= 0; i--) if (selectedIds.includes(nodes[i]!.id)) nodes.splice(i, 1)
        }
        remove(doc.frames)
        for (const frame of doc.frames) {
          walk(frame as AnyNode, (node) => {
            if ("children" in node) remove(node.children)
            if ("slots" in node && node.slots) Object.values(node.slots).forEach(remove)
          })
        }
      })
      setState((s) => ({ ...s, selectedIds: [] }))
    },

    undo: () =>
      setState((s) => {
        const previous = s.past.at(-1)
        if (!previous) return s
        return { ...s, doc: previous, past: s.past.slice(0, -1), future: [s.doc, ...s.future] }
      }),

    redo: () =>
      setState((s) => {
        const [next, ...future] = s.future
        if (!next) return s
        return { ...s, doc: next, past: [...s.past, s.doc], future }
      }),
  }
}

export type EditorStore = ReturnType<typeof createEditorStore>
