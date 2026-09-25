import type { ReactNode } from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("flex flex-wrap items-center justify-between", {
  variants: { density: { compact: "gap-2", comfortable: "gap-4" } },
  defaultVariants: { density: "compact" },
})
export function FilterBar({
  children,
  actions,
  density = "compact",
}: {
  children: ReactNode
  actions?: ReactNode
  density?: "compact" | "comfortable"
}) {
  return (
    <div className={variants({ density })}>
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center",
          density === "compact" ? "gap-2" : "gap-4"
        )}
      >
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
