import { memo } from "react"
import { motion, useTransform } from "motion/react"
import { useSelector } from "@tanstack/react-store"
import { useEditor, useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { CanvasFrame } from "./CanvasFrame"

const StableCanvasFrame = memo(CanvasFrame)
export function CanvasWorld() {
  const editor = useEditor(),
    doc = useEditorState((s) => s.doc)
  const draft = useSelector(editor.canvas.draft)
  const transform = useTransform(
    editor.canvas.viewport,
    (v) => `translate(${v.x}px, ${v.y}px) scale(${v.zoom})`
  )
  return (
    <motion.div className="editor-world absolute top-0 left-0 origin-top-left w-0 h-0 [will-change:transform]" style={{ transform }}>
      {framesOf(draft?.doc ?? doc)
        .filter((frame) => !frame.hidden)
        .map((frame) => (
          <StableCanvasFrame key={frame.id} frame={frame} />
        ))}
    </motion.div>
  )
}
