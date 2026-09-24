import type { RemixiconComponentType } from "@remixicon/react"
import { cn } from "cn"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type IconButtonProps = Omit<ComponentProps<typeof Button>, "children" | "size"> & {
  icon: RemixiconComponentType
  label: string
  active?: boolean
  size?: "xs" | "sm"
}

/** Square icon-only button with an accessible label (shown as a native tooltip). */
export function IconButton({ icon: Icon, label, active, size = "sm", className, variant = "ghost", ...props }: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size === "xs" ? "icon-xs" : "icon-sm"}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground", className)}
      {...props}
    >
      <Icon />
    </Button>
  )
}
