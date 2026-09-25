import type { ReactNode } from "react"
import type { RiEditLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

export function ResourceMenuAction({
  icon: Icon,
  onSelect,
  children,
}: {
  icon: typeof RiEditLine
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={onSelect}
      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="min-w-0 truncate">{children}</span>
    </Button>
  )
}
