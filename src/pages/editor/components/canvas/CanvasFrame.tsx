import { useRef } from "react"
import { motion, useTransform } from "motion/react"
import type { FrameNode } from "@digit-ai-studio/shared"
import { useEditor, useEditorState } from "@/features/editor/context"
import { frameDimension } from "@/features/editor/geometry"
import { useFrameRenderer } from "@/features/editor/use-frame-renderer"

export function CanvasFrame({ frame }: { frame: FrameNode }) {
  const editor = useEditor(),
    iframe = useRef<HTMLIFrameElement>(null)
  const { ready, initialize, mode } = useFrameRenderer(frame, iframe)
  const selected = useEditorState((s) => s.selectedIds.includes(frame.id))
  const contentHeight = useEditorState(
    (s) => s.layouts[frame.id]?.contentHeight ?? 900
  )
  const contentWidth = useEditorState(
    (s) => s.layouts[frame.id]?.contentWidth ?? 1
  )
  const transform = useTransform(() => {
    const rect = editor.canvas.visual.get().preview?.rects[frame.id]
    return `translate(${rect?.x ?? frame.x}px, ${rect?.y ?? frame.y}px)`
  })
  const width = useTransform(
    () =>
      editor.canvas.visual.get().preview?.rects[frame.id]?.width ??
      frameDimension(
        frame,
        "width",
        editor.canvas.visual.get().frameSizes[frame.id]?.width ?? contentWidth
      )
  )
  const height = useTransform(
    () =>
      editor.canvas.visual.get().preview?.rects[frame.id]?.height ??
      frameDimension(
        frame,
        "height",
        editor.canvas.visual.get().frameSizes[frame.id]?.height ?? contentHeight
      )
  )
  const size = useTransform(
    () => `${Math.round(width.get())} × ${Math.round(height.get())}`
  )
  return (
    <motion.div
      className="editor-artboard absolute top-0 left-0 shadow-[0_0_0_1px_color-mix(in_srgb,_var(--foreground),_transparent_92%),_0_2px_5px_#00000004] bg-white [&[data-selected]_.editor-frame-title]:[color:var(--editor-selection)]"
      data-frame-id={frame.id}
      data-selected={selected || undefined}
      style={{ transform, width, height }}
    >
      <div className="editor-frame-title absolute top-[-27px] left-0 w-full flex justify-between items-center gap-2 h-[22px] [font:12px/1.2_var(--font-sans)] whitespace-nowrap text-muted-foreground select-none [&_span]:text-[10px] [&_span]:opacity-[0.7]" data-frame-label={frame.id}>
        {frame.name}
        <motion.span>{size}</motion.span>
      </div>
      <iframe
        ref={iframe}
        title={frame.name}
        src={`/renderer/index.html?frameId=${encodeURIComponent(frame.id)}`}
        onLoad={initialize}
        className="editor-frame-iframe w-full h-full border-0 block bg-white"
        data-ready={ready || undefined}
        tabIndex={mode === "preview" ? 0 : -1}
      />
      {!ready && (
        <div className="editor-frame-loading absolute [inset:0] grid place-items-center text-[14px] [color:#737373] bg-white">Chargement des composants…</div>
      )}
    </motion.div>
  )
}
