import type { ComponentProps } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ContextMenuItem } from "@/components/ui/context-menu"
import { SPRING_LAYOUT } from "@/lib/motion"
import { cn } from "cn"

export function AnimatedContextMenuItem({
  children,
  className,
  variant,
  ...props
}: Omit<ComponentProps<typeof ContextMenuItem>, "render" | "className"> & {
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <ContextMenuItem
      {...props}
      variant={variant}
      className={cn(
        "isolate rounded-lg px-2.5 py-2 focus:bg-transparent data-[variant=destructive]:focus:bg-transparent dark:data-[variant=destructive]:focus:bg-transparent",
        className
      )}
      render={(itemProps, state) => (
        <div {...itemProps}>
          {state.highlighted && !state.disabled && (
            <motion.span
              aria-hidden="true"
              layoutId="context-menu-active"
              className={cn(
                "pointer-events-none absolute inset-0 -z-10 rounded-lg bg-foreground/[.065]",
                variant === "destructive" && "bg-destructive/10"
              )}
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            />
          )}
          {children}
        </div>
      )}
    />
  )
}
