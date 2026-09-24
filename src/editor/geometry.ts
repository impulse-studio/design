import { type AnyNode, type FrameNode, type Rect, walk } from "@digit-ai-studio/shared"

import type { EditorState, Point, Viewport } from "./store"

export function screenToCanvas(point: Point, viewport: Viewport): Point {
  return { x: (point.x - viewport.x) / viewport.zoom, y: (point.y - viewport.y) / viewport.zoom }
}

export function canvasToScreen(rect: Rect, viewport: Viewport): Rect {
  return {
    x: viewport.x + rect.x * viewport.zoom,
    y: viewport.y + rect.y * viewport.zoom,
    width: rect.width * viewport.zoom,
    height: rect.height * viewport.zoom,
  }
}

export function frameHeight(frame: FrameNode, contentHeight: number | undefined): number {
  return frame.height === "hug" ? (contentHeight ?? 0) : frame.height
}

const contains = (r: Rect, p: Point) => p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height

/** Box of a node in canvas coordinates (frames are positioned on the canvas, nodes inside their frame). */
export function nodeCanvasRect(state: EditorState, frame: FrameNode, nodeId: string): Rect | null {
  const origin = { x: frame.x, y: frame.y }
  if (nodeId === frame.id) {
    return { ...origin, width: frame.width, height: frameHeight(frame, state.layouts[frame.id]?.contentHeight) }
  }
  const rect = state.layouts[frame.id]?.rects[nodeId]
  return rect ? { ...rect, x: rect.x + origin.x, y: rect.y + origin.y } : null
}

/** Deepest node under a canvas point: the last match in pre-order is the innermost/topmost one. */
export function hitTest(state: EditorState, point: Point): { frame: FrameNode; nodeId: string } | null {
  for (const frame of [...state.doc.frames].reverse()) {
    const frameRect = nodeCanvasRect(state, frame, frame.id)
    if (!frameRect || !contains(frameRect, point)) continue
    let hit = frame.id
    walk(frame as AnyNode, (node) => {
      if (node.id === frame.id || ("hidden" in node && node.hidden)) return
      const rect = nodeCanvasRect(state, frame, node.id)
      if (rect && contains(rect, point)) hit = node.id
    })
    return { frame, nodeId: hit }
  }
  return null
}

export function contentBounds(state: EditorState): Rect | null {
  const rects = state.doc.frames.map((f) => nodeCanvasRect(state, f, f.id)).filter((r): r is Rect => r !== null)
  if (rects.length === 0) return null
  const x = Math.min(...rects.map((r) => r.x))
  const y = Math.min(...rects.map((r) => r.y))
  const right = Math.max(...rects.map((r) => r.x + r.width))
  const bottom = Math.max(...rects.map((r) => r.y + r.height))
  return { x, y, width: right - x, height: bottom - y }
}

export function fitViewport(bounds: Rect, screen: { width: number; height: number }, padding: number): Viewport {
  const zoom = Math.min((screen.width - padding * 2) / bounds.width, (screen.height - padding * 2) / bounds.height)
  return {
    zoom,
    x: (screen.width - bounds.width * zoom) / 2 - bounds.x * zoom,
    y: (screen.height - bounds.height * zoom) / 2 - bounds.y * zoom,
  }
}
