import { useId } from "react"
import type { ComponentProps } from "react"
import { LayoutGroup } from "motion/react"
import { ContextMenuContent } from "@/components/ui/context-menu"
import { cn } from "cn"
import styles from "./context-menu.module.css"

// Adapted from beui.dev/components/motion/context-menu; shadcn owns interaction.
export function AnimatedContextMenuContent({
  children,
  className,
  ...props
}: ComponentProps<typeof ContextMenuContent>) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <ContextMenuContent
        className={cn("min-w-52 rounded-xl p-1.5", styles.content, className)}
        {...props}
      >
        {children}
      </ContextMenuContent>
    </LayoutGroup>
  )
}
