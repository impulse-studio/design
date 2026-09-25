import { motion, useTransform } from "motion/react"
import type { Rect } from "@digit-ai-studio/shared"
import { useEditor } from "@/features/editor/context"
import { Button } from "@/components/ui/button"

export function CanvasOutline({
  getRect,
  className,
  handles = false,
  label = false,
}: {
  getRect: () => Rect | null
  className: string
  handles?: boolean
  label?: boolean
}) {
  const { canvas } = useEditor()
  const display = useTransform(() => (getRect() ? "block" : "none"))
  const transform = useTransform(() => {
    const rect = getRect(),
      v = canvas.viewport.get()
    return `translate(${(rect?.x ?? 0) * v.zoom + v.x}px, ${(rect?.y ?? 0) * v.zoom + v.y}px)`
  })
  const width = useTransform(
    () => (getRect()?.width ?? 0) * canvas.viewport.get().zoom
  )
  const height = useTransform(
    () => (getRect()?.height ?? 0) * canvas.viewport.get().zoom
  )
  const size = useTransform(() => {
    const rect = getRect()
    return `${Math.round(rect?.width ?? 0)} × ${Math.round(rect?.height ?? 0)}`
  })
  return (
    <motion.div
      className={className}
      style={{ display, transform, width, height, left: 0, top: 0 }}
    >
      {handles &&
        ["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => (
          <Button
            key={handle}
            variant="ghost"
            size="icon-xs"
            className="editor-resize-handle absolute [width:8px!important] [height:8px!important] min-w-0 [padding:0] border [border-color:var(--editor-selection)] rounded-none [background:white!important] pointer-events-auto [transform:translate(-50%,_-50%)!important] [&[data-handle=nw]]:left-0 [&[data-handle=nw]]:top-0 [&[data-handle=nw]]:cursor-nwse-resize [&[data-handle=n]]:left-[50%] [&[data-handle=n]]:top-0 [&[data-handle=n]]:cursor-ns-resize [&[data-handle=ne]]:left-full [&[data-handle=ne]]:top-0 [&[data-handle=ne]]:cursor-nesw-resize [&[data-handle=e]]:left-full [&[data-handle=e]]:top-[50%] [&[data-handle=e]]:cursor-ew-resize [&[data-handle=se]]:left-full [&[data-handle=se]]:top-full [&[data-handle=se]]:cursor-nwse-resize [&[data-handle=s]]:left-[50%] [&[data-handle=s]]:top-full [&[data-handle=s]]:cursor-ns-resize [&[data-handle=sw]]:left-0 [&[data-handle=sw]]:top-full [&[data-handle=sw]]:cursor-nesw-resize [&[data-handle=w]]:left-0 [&[data-handle=w]]:top-[50%] [&[data-handle=w]]:cursor-ew-resize"
            data-handle={handle}
            aria-label={`Redimensionner ${handle}`}
          />
        ))}
      {label && <motion.span className="editor-size-label absolute top-[calc(100%_+_10px)] left-[50%] -translate-x-1/2 py-0.5 px-1.25 rounded-[3px] text-[10px] leading-[16px] tabular-nums whitespace-nowrap text-white [background:var(--editor-selection)]">{size}</motion.span>}
    </motion.div>
  )
}
