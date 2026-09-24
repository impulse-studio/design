import { cn } from "cn"
import type { ReactNode } from "react"

/** Side panel of the editor (layers on the left, inspector on the right). */
export function Panel({ side, width, children }: { side: "left" | "right"; width: number; children: ReactNode }) {
  return (
    <aside
      style={{ width }}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden bg-background text-xs",
        side === "left" ? "border-r" : "border-l",
      )}
    >
      {children}
    </aside>
  )
}

export function PanelHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-3", className)}>{children}</div>
}

export function PanelBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto", className)}>{children}</div>
}

/** Titled block inside a panel, like Figma's "Auto layout" or "Layers" sections. */
export function PanelSection({
  title,
  action,
  flush,
  children,
  className,
}: {
  title: ReactNode
  action?: ReactNode
  /** Lets the content span the full panel width (trees, lists). */
  flush?: boolean
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cn("border-b py-3 last:border-b-0", className)}>
      <div className="mb-2 flex h-6 items-center justify-between px-3">
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children && <div className={cn("flex flex-col gap-2", !flush && "px-3")}>{children}</div>}
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-3 py-6 text-center text-xs text-muted-foreground">{children}</p>
}
