import { createStore } from "@tanstack/react-store"
import { motionValue } from "motion/react"
import type { GeometryPreview, MockupDoc, Rect } from "@digit-ai-studio/shared"
import type { FrameLayout, Viewport } from "./types"

export type Guide = { axis: "x" | "y"; value: number }
export type CanvasPreview = {
  session: number
  rects: Record<string, Rect>
  frames: Record<string, GeometryPreview[]>
}
export type CanvasDraft = {
  doc: MockupDoc
  selectedIds: string[]
  layouts: Partial<Record<string, FrameLayout>>
}
export type CanvasVisual = {
  preview: CanvasPreview | null
  marquee: Rect | null
  guides: Guide[]
  measurement: { from: Rect; to: Rect } | null
  frameSizes: Partial<Record<string, { width: number; height: number }>>
}
const emptyVisual = (): CanvasVisual => ({
  preview: null,
  marquee: null,
  guides: [],
  measurement: null,
  frameSizes: {},
})

/** High-frequency state never travels through the document/inspector store. */
export const createCanvasRuntime = (initial: Viewport) => {
  const viewport = motionValue(initial)
  const visual = motionValue<CanvasVisual>(emptyVisual())
  const draft = createStore<CanvasDraft | null>(null)
  let session = 0
  let cancelGesture: (() => void) | null = null
  return {
    viewport,
    visual,
    draft,
    nextSession: () => ++session,
    setVisual: (patch: Partial<CanvasVisual>) =>
      visual.set({ ...visual.get(), ...patch }),
    reset: () => {
      visual.set(emptyVisual())
      draft.setState(() => null)
    },
    registerCancel: (cancel: (() => void) | null) => {
      cancelGesture = cancel
    },
    cancel: () => cancelGesture?.(),
    setViewport: (next: Viewport) => {
      if (![next.x, next.y, next.zoom].every(Number.isFinite)) return
      const value = { ...next, zoom: Math.max(0.05, Math.min(4, next.zoom)) }
      const previous = viewport.get()
      if (
        value.x !== previous.x ||
        value.y !== previous.y ||
        value.zoom !== previous.zoom
      )
        viewport.set(value)
    },
    zoomAt: (point: { x: number; y: number }, factor: number) => {
      if (!Number.isFinite(factor) || factor <= 0) return
      const current = viewport.get()
      const zoom = Math.max(0.05, Math.min(4, current.zoom * factor))
      const ratio = zoom / current.zoom
      viewport.set({
        x: point.x - (point.x - current.x) * ratio,
        y: point.y - (point.y - current.y) * ratio,
        zoom,
      })
    },
  }
}
