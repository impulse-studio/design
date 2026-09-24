import { cn } from "cn"
import { type PointerEvent, useEffect, useRef, useState } from "react"

import { CANVAS_BACKGROUND, ZOOM } from "../constants"
import { useEditor, useEditorActions, useEditorStore } from "../context"
import { contentBounds, fitViewport, hitTest, screenToCanvas } from "../geometry"
import { CanvasFrame } from "./CanvasFrame"
import { SelectionOverlay } from "./SelectionOverlay"

export function Canvas() {
  const store = useEditorStore()
  const { select, hover, panBy, zoomAt, setViewport } = useEditorActions()
  const frames = useEditor((s) => s.doc.frames)
  const viewport = useEditor((s) => s.viewport)
  const tool = useEditor((s) => s.tool)
  const hasLayouts = useEditor((s) => Object.keys(s.layouts).length === s.doc.frames.length)

  const containerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const [spaceDown, setSpaceDown] = useState(false)
  const [panning, setPanning] = useState(false)
  const fitted = useRef(false)

  const localPoint = (e: { clientX: number; clientY: number }) => {
    const box = containerRef.current!.getBoundingClientRect()
    return { x: e.clientX - box.left, y: e.clientY - box.top }
  }

  const fitAll = () => {
    const bounds = contentBounds(store.state)
    const box = containerRef.current?.getBoundingClientRect()
    if (bounds && box) setViewport(fitViewport(bounds, box, ZOOM.fitPadding))
  }

  // Fit everything once all frames have reported their size.
  useEffect(() => {
    if (hasLayouts && !fitted.current) {
      fitted.current = true
      fitAll()
    }
  }, [hasLayouts])

  // Wheel: pinch / ⌘ + wheel zooms, plain wheel pans. Registered natively to be able to preventDefault.
  useEffect(() => {
    const el = containerRef.current!
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) zoomAt(localPoint(e), Math.exp(-e.deltaY * ZOOM.wheelSensitivity))
      else panBy(-e.deltaX, -e.deltaY)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoomAt, panBy])

  useEffect(() => {
    const isTyping = (e: KeyboardEvent) => (e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isTyping(e)) {
        e.preventDefault()
        setSpaceDown(true)
      }
      if (e.shiftKey && e.code === "Digit1" && !isTyping(e)) fitAll()
    }
    const up = (e: KeyboardEvent) => e.code === "Space" && setSpaceDown(false)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  const wantsPan = tool === "hand" || spaceDown

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (wantsPan || e.button === 1) {
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, y: e.clientY }
      setPanning(true)
      return
    }
    const hit = hitTest(store.state, screenToCanvas(localPoint(e), viewport))
    select(hit?.nodeId ?? null, e.shiftKey)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) {
      panBy(e.clientX - drag.current.x, e.clientY - drag.current.y)
      drag.current = { x: e.clientX, y: e.clientY }
      return
    }
    if (!wantsPan) hover(hitTest(store.state, screenToCanvas(localPoint(e), viewport))?.nodeId ?? null)
  }

  const onPointerUp = () => {
    drag.current = null
    setPanning(false)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full min-w-0 flex-1 overflow-hidden select-none", wantsPan && (panning ? "cursor-grabbing" : "cursor-grab"))}
      style={{ background: CANVAS_BACKGROUND }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => hover(null)}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}
      >
        {frames.map((frame) => (
          <CanvasFrame key={frame.id} frame={frame} />
        ))}
      </div>
      <SelectionOverlay />
    </div>
  )
}
