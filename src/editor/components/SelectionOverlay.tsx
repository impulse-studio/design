import type { Rect } from "@digit-ai-studio/shared"
import type { ReactNode } from "react"

import { SELECTION_COLOR } from "../constants"
import { useEditor } from "../context"
import { canvasToScreen, nodeCanvasRect } from "../geometry"
import type { EditorState } from "../store"

function screenRectOf(state: EditorState, nodeId: string): Rect | null {
  for (const frame of state.doc.frames) {
    const rect = nodeCanvasRect(state, frame, nodeId)
    if (rect) return canvasToScreen(rect, state.viewport)
  }
  return null
}

function Box({ rect, children }: { rect: Rect; children?: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        outline: `1px solid ${SELECTION_COLOR}`,
      }}
    >
      {children}
    </div>
  )
}

const HANDLES = ["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"]

/** Screen-space layer above the frames: frame titles, hover outline, selection box and size label. */
export function SelectionOverlay() {
  const state = useEditor((s) => s)
  const { viewport, hoveredId, selectedIds, doc } = state

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {doc.frames.map((frame) => {
        const rect = canvasToScreen({ x: frame.x, y: frame.y, width: frame.width, height: 0 }, viewport)
        const selected = selectedIds.includes(frame.id)
        return (
          <div
            key={frame.id}
            className="absolute truncate text-[11px]"
            style={{ left: rect.x, top: rect.y - 18, maxWidth: rect.width, color: selected ? SELECTION_COLOR : "#8a8a8a" }}
          >
            {frame.name}
          </div>
        )
      })}

      {hoveredId && !selectedIds.includes(hoveredId) && (() => {
        const rect = screenRectOf(state, hoveredId)
        return rect && <Box rect={rect} />
      })()}

      {selectedIds.map((id) => {
        const rect = screenRectOf(state, id)
        if (!rect) return null
        return (
          <Box key={id} rect={rect}>
            {HANDLES.map((pos) => (
              <span key={pos} className={`absolute size-2 border bg-white ${pos}`} style={{ borderColor: SELECTION_COLOR }} />
            ))}
            <span
              className="absolute left-1/2 mt-1.5 -translate-x-1/2 rounded-sm px-1 text-[10px] whitespace-nowrap text-white tabular-nums"
              style={{ top: "100%", background: SELECTION_COLOR }}
            >
              {Math.round(rect.width / viewport.zoom)} × {Math.round(rect.height / viewport.zoom)}
            </span>
          </Box>
        )
      })}
    </div>
  )
}
