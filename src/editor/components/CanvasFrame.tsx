import { type FrameNode, RENDERER_PATH } from "@digit-ai-studio/shared"
import { memo } from "react"

import { useEditor } from "../context"
import { frameHeight } from "../geometry"
import { useFrameBridge } from "../useFrameBridge"

/** One artboard: an iframe at the frame's real size, placed in canvas coordinates. */
export const CanvasFrame = memo(function CanvasFrame({ frame }: { frame: FrameNode }) {
  const iframeRef = useFrameBridge(frame, "edit")
  const contentHeight = useEditor((s) => s.layouts[frame.id]?.contentHeight)
  const height = frameHeight(frame, contentHeight)

  return (
    <div
      className="absolute bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ left: frame.x, top: frame.y, width: frame.width, height }}
    >
      <iframe
        ref={iframeRef}
        title={frame.name}
        src={`${RENDERER_PATH}?mode=edit`}
        // Pointer events are handled by the canvas overlay (hit-testing on reported node boxes).
        className="pointer-events-none block border-0"
        style={{ width: frame.width, height }}
      />
    </div>
  )
})
