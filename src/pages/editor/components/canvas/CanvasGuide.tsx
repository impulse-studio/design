import { motion, useTransform } from "motion/react"
import { useEditor } from "@/features/editor/context"

export function CanvasGuide({ axis }: { axis: "x" | "y" }) {
  const { canvas } = useEditor()
  const opacity = useTransform(() =>
    canvas.visual.get().guides.some((guide) => guide.axis === axis) ? 1 : 0
  )
  const transform = useTransform(() => {
    const guide = canvas.visual.get().guides.find((item) => item.axis === axis),
      v = canvas.viewport.get()
    const position = (guide?.value ?? 0) * v.zoom + v[axis]
    return axis === "x"
      ? `translateX(${position}px)`
      : `translateY(${position}px)`
  })
  return (
    <motion.div
      className="editor-guide absolute [background:var(--editor-guide)] [&[data-axis=x]]:top-0 [&[data-axis=x]]:bottom-0 [&[data-axis=x]]:w-[1px] [&[data-axis=y]]:left-0 [&[data-axis=y]]:right-0 [&[data-axis=y]]:h-[1px]"
      data-axis={axis}
      style={{ opacity, transform, [axis === "x" ? "left" : "top"]: 0 }}
    />
  )
}
