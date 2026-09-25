import { motion, useTransform } from "motion/react"
import { useEditor } from "@/features/editor/context"

export function CanvasMeasurement() {
  const { canvas } = useEditor()
  const display = useTransform(() =>
    canvas.visual.get().measurement ? "block" : "none"
  )
  const transform = useTransform(() => {
    const measure = canvas.visual.get().measurement,
      v = canvas.viewport.get()
    if (!measure) return "none"
    return `translate(${(measure.from.x + measure.from.width / 2) * v.zoom + v.x}px, ${Math.min(measure.from.y, measure.to.y) * v.zoom + v.y - 28}px)`
  })
  const text = useTransform(() => {
    const measure = canvas.visual.get().measurement
    if (!measure) return ""
    const { from, to } = measure
    return `${Math.round(Math.max(0, to.x - from.x - from.width, from.x - to.x - to.width))} px ↔ · ${Math.round(Math.max(0, to.y - from.y - from.height, from.y - to.y - to.height))} px ↕`
  })
  return (
    <motion.div
      className="editor-measurement absolute py-0.75 px-1.5 [background:var(--editor-guide)] text-white rounded-[3px] text-[10px] whitespace-nowrap"
      style={{ display, transform, left: 0, top: 0 }}
    >
      {text}
    </motion.div>
  )
}
