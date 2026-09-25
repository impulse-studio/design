import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export function ResponseAction({
  label,
  active = false,
  toggle = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  toggle?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={toggle ? active : undefined}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
