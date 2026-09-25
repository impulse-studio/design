import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function EditorIsland({
  children,
  label,
  mode,
  className,
}: {
  children: ReactNode
  label: string
  mode?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "editor-island absolute bottom-[12px] left-[50%] z-[4] flex h-auto max-w-[calc(100%_-_24px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-border/60 bg-background p-1 text-[11px] text-foreground shadow-[0_2px_4px_#00000006,0_8px_24px_#0000000a] max-[420px]:gap-1.25 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:[transition:none] [&_.editor-tool]:h-[32px] [&_.editor-tool]:w-[32px] [&_.editor-tool]:min-w-[32px] [&_.editor-tool]:rounded-[5px] [&_.editor-tool]:bg-transparent [&_.editor-tool]:[padding:0] [&_.editor-tool]:text-foreground [&_.editor-tool_svg]:h-[22px] [&_.editor-tool_svg]:w-[22px] [&_.editor-tool-chevron]:h-[32px] [&_.editor-tool-chevron]:w-[14px] [&_.editor-tool-chevron]:min-w-[14px] [&_.editor-tool-chevron]:rounded-sm [&_.editor-tool-chevron]:[padding:0] [&_.editor-tool-chevron_svg]:h-[12px] [&_.editor-tool-chevron_svg]:w-[12px] [&_.editor-tool[aria-pressed=true]]:[color:var(--editor-on-accent)] [&_.editor-tool[aria-pressed=true]]:[background:var(--editor-selection)] [&_>_[data-slot=toggle-group]]:gap-1 max-[420px]:[&_>_[data-slot=toggle-group]]:gap-0.5 [&_>_button]:h-[32px] [&_>_button]:w-[32px] [&_>_button_svg]:h-[22px] [&_>_button_svg]:w-[22px] [&_button]:[transition:background-color_var(--motion-fast)_var(--motion-ease-out),_color_var(--motion-fast)_var(--motion-ease-out)] motion-reduce:[&_button]:[transition:none] [&[data-mode=inspect]_.editor-tool[aria-pressed=true]]:[background:var(--editor-dev)] [@media(hover:hover)_and_(pointer:fine)]:[&_button:not([aria-pressed=true]):hover]:bg-accent [@media(hover:none),_(pointer:coarse)]:[&_.editor-tool]:h-[44px] [@media(hover:none),_(pointer:coarse)]:[&_.editor-tool]:w-[44px] [@media(hover:none),_(pointer:coarse)]:[&_>_button]:h-[44px] [@media(hover:none),_(pointer:coarse)]:[&_>_button]:w-[44px]",
        className
      )}
      data-canvas-control
      data-mode={mode}
      role="toolbar"
      aria-label={label}
    >
      {children}
    </div>
  )
}
