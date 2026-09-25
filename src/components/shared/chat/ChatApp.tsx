"use client"
// beui.dev/components/agents/chat-app

import type { ComponentProps, CSSProperties } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ShellFit } from "./ShellFit"
import { cn } from "@/lib/utils"

/**
 * Shell width below which a docked sidebar leaves too little room for the
 * conversation: the default sidebar is 17rem, so under 600px the conversation
 * pane is left with barely 330px — narrower than a phone.
 *
 * Deliberately not AnimatedSidebar's own 767px mobile query: that one asks
 * whether the *viewport* is a phone (and swaps the sidebar for an off-canvas
 * sheet), this one asks whether the *shell's own box* — which may be a column,
 * a split view or a panel inside a much wider page — still fits both panes.
 */
const MIN_DOCKED_WIDTH = 600

export interface ChatAppProps extends ComponentProps<typeof SidebarProvider> {
  /** Docked sidebar width as a CSS length. Default `17rem`. */
  sidebarWidth?: string
  /**
   * Shell width in px under which the sidebar folds off-canvas. Ignored while
   * `open` is controlled — the consumer owns the state then.
   */
  collapseSidebarBelow?: number
}

/**
 * Folds the sidebar away while the shell is too narrow to carry both panes,
 * and brings it back when it isn't. Only crossings are acted on, so a manual
 * toggle at either size stays put until the shell actually changes shape.
 *
 * Mount is not a crossing in the opening direction: a shell that merely has
 * room says nothing about whether the caller wanted the sidebar open, so the
 * first measurement leaves `defaultOpen` alone. Too narrow at mount *is* the
 * fold condition itself, so that half applies immediately.
 */
export function ChatApp({
  children,
  className,
  sidebarWidth = "17rem",
  collapseSidebarBelow = MIN_DOCKED_WIDTH,
  style,
  ...props
}: ChatAppProps) {
  return (
    <SidebarProvider
      keyboardShortcut={false}
      persistState={false}
      {...props}
      style={{ ...style, "--sidebar-width": sidebarWidth } as CSSProperties}
      className={cn(
        "@container min-h-0 w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-background",
        className
      )}
    >
      {/* A controlled `open` is the consumer's to change; fitting the shell
          would fire an onOpenChange they never asked for. */}
      {props.open === undefined ? (
        <ShellFit minWidth={collapseSidebarBelow} />
      ) : null}
      {children}
    </SidebarProvider>
  )
}
