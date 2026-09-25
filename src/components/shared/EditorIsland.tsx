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
      className={cn("editor-island absolute z-[4] bottom-[12px] left-[50%] -translate-x-1/2 flex items-center gap-3 h-[48px] p-2 border-0 rounded-[14px] bg-background shadow-[var(--editor-island-shadow)] text-foreground text-[11px] max-w-[calc(100%_-_24px)] [&_>_[data-slot=toggle-group]]:gap-2 [&_.editor-tool]:w-[32px] [&_.editor-tool]:h-[32px] [&_.editor-tool]:min-w-[32px] [&_.editor-tool]:[padding:0] [&_.editor-tool]:rounded-[5px] [&_.editor-tool]:bg-transparent [&_.editor-tool]:text-foreground [&_.editor-tool[aria-pressed=true]]:[background:var(--editor-selection)] [&_.editor-tool[aria-pressed=true]]:[color:var(--editor-on-accent)] [&[data-mode=inspect]_.editor-tool[aria-pressed=true]]:[background:var(--editor-dev)] [&_.editor-tool_svg]:w-[22px] [&_.editor-tool_svg]:h-[22px] [&_.editor-tool-chevron]:w-[14px] [&_.editor-tool-chevron]:h-[32px] [&_.editor-tool-chevron]:min-w-[14px] [&_.editor-tool-chevron]:[padding:0] [&_.editor-tool-chevron]:rounded-sm [&_.editor-tool-chevron_svg]:w-[12px] [&_.editor-tool-chevron_svg]:h-[12px] [&_>_button]:h-[32px] [&_>_button]:w-[32px] [&_>_button_svg]:w-[22px] [&_>_button_svg]:h-[22px] [&_.editor-mode-switch]:p-0.5 [&_.editor-mode-switch]:gap-0.5 [&_.editor-mode-switch]:h-[32px] [&_.editor-mode-switch]:bg-muted [&_.editor-mode-switch]:rounded-md [&[data-mode=inspect]_.editor-mode-switch_[aria-pressed=true]]:[color:var(--editor-dev)] [@media(hover:hover)_and_(pointer:fine)]:[&_button:not([aria-pressed=true]):hover]:bg-accent [@media(hover:none),_(pointer:coarse)]:h-[56px] [@media(hover:none),_(pointer:coarse)]:p-1.5 [@media(hover:none),_(pointer:coarse)]:[&_.editor-tool]:w-[44px] [@media(hover:none),_(pointer:coarse)]:[&_.editor-tool]:h-[44px] [@media(hover:none),_(pointer:coarse)]:[&_>_button]:w-[44px] [@media(hover:none),_(pointer:coarse)]:[&_>_button]:h-[44px] max-[420px]:gap-1.25 max-[420px]:px-1.25 max-[420px]:[&_>_[data-slot=toggle-group]]:gap-0.5 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:[transition:none] [&_button]:[transition:background-color_var(--motion-fast)_var(--motion-ease-out),_color_var(--motion-fast)_var(--motion-ease-out)] motion-reduce:[&_button]:[transition:none]", className)}
      data-canvas-control
      data-mode={mode}
      role="toolbar"
      aria-label={label}
    >
      {children}
    </div>
  )
}
