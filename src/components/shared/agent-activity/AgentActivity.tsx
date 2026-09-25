"use client"
// beui.dev/components/agents/agent-activity

import { RiArrowDownSLine as ChevronDown } from "@remixicon/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useControllableOpen } from "@/hooks/use-controllable-open"
import { getContentType, getActiveLabel, getSummary } from "./summaries"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ActivityRow } from "./ActivityRow"
import type { AgentActivityProps } from "./types"

export type {
  AgentActivityProps,
  AgentActivitySearch,
  AgentActivityStatus,
  AgentActivityStep,
  AgentActivityText,
  AgentActivityTool,
  AgentActivityTrace,
  AgentSearchResult,
  AgentStepStatus,
  AgentTraceKind,
} from "./types"

export function AgentActivity({
  items,
  contentType: initialContentType,
  status = "working",
  duration = 0,
  open,
  defaultOpen = false,
  onOpenChange,
  collapseOnComplete = true,
  activeLabel,
  summary,
  renderWorkingStatus,
  renderCompletedStatus,
  maxHeight = 208,
  className,
  contentClassName,
}: AgentActivityProps) {
  const reduce = useReducedMotion() ?? false
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const contentId = `${baseId}-content`
  const contentRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const previousStatus = useRef(status)
  const [contentHeight, setContentHeight] = useState(0)
  const [currentOpen, setOpen] = useControllableOpen({
    open,
    defaultOpen,
    onOpenChange,
  })
  const working = status === "working"
  const expanded = working || currentOpen
  const contentType = items.length
    ? getContentType(items)
    : (initialContentType ?? "mixed")
  const cappedHeight = Math.min(contentHeight, Math.max(0, maxHeight))
  const viewportHeight = working ? Math.max(0, maxHeight) : cappedHeight
  const capped = contentHeight > maxHeight
  const streamOffset = working ? Math.min(0, viewportHeight - contentHeight) : 0

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return

    const measure = () => setContentHeight(node.offsetHeight)
    measure()

    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (previousStatus.current === "working" && status === "complete") {
      setOpen(!collapseOnComplete)
    }
    previousStatus.current = status
  }, [collapseOnComplete, setOpen, status])

  const toggle = () => {
    const next = !currentOpen
    setOpen(next)
    if (next)
      requestAnimationFrame(() =>
        (() => {
          if (viewportRef.current) viewportRef.current.scrollTop = 0
        })()
      )
  }

  const liveLabel = activeLabel ?? getActiveLabel(contentType)
  const completedSummary = summary ?? getSummary(contentType, items, duration)
  const maskImage = capped
    ? working
      ? "linear-gradient(to bottom, transparent, black 12px)"
      : "linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)"
    : undefined

  return (
    <div
      data-state={working ? "working" : expanded ? "open" : "closed"}
      data-content={contentType}
      aria-busy={working}
      className={cn("w-full text-sm", className)}
    >
      {working ? (
        <div
          id={triggerId}
          role="status"
          className="flex h-7 min-w-0 items-center text-muted-foreground"
        >
          {renderWorkingStatus ? (
            renderWorkingStatus({ label: liveLabel, duration })
          ) : (
            <span className={reduce ? undefined : "task-list-active-text [background-image:linear-gradient(_100deg,_var(--foreground)_35%,_var(--muted-foreground)_50%,_var(--foreground)_65%_)] [background-size:250%_100%] bg-clip-text [-webkit-background-clip:text] text-transparent animate-[task-list-shimmer_2.8s_linear_infinite] [@media(prefers-reduced-motion:reduce),_(forced-colors:active)]:animate-none [@media(prefers-reduced-motion:reduce),_(forced-colors:active)]:[background:none] [@media(prefers-reduced-motion:reduce),_(forced-colors:active)]:text-foreground"}>
              {liveLabel}
            </span>
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          id={triggerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={toggle}
          className="group flex h-7 min-w-0 items-center gap-1.5 rounded-md text-left font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="truncate">
            {renderCompletedStatus
              ? renderCompletedStatus({ summary: completedSummary, duration })
              : completedSummary}
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : SPRING_SWAP}
            className="inline-flex shrink-0 text-muted-foreground/70 group-hover:text-foreground"
          >
            <ChevronDown className="size-3.5" />
          </motion.span>
        </Button>
      )}

      <Collapsible open={expanded}>
        <CollapsibleContent
          keepMounted
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
        >
          <div
            ref={viewportRef}
            className={cn(
              "scrollbar-hide pr-1",
              capped && expanded && !working
                ? "overflow-y-auto"
                : "overflow-y-hidden"
            )}
            style={{
              height: viewportHeight,
              maskImage,
              WebkitMaskImage: maskImage,
            }}
          >
            <motion.div
              ref={contentRef}
              role="list"
              initial={false}
              animate={{ y: streamOffset }}
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              className={cn("flex flex-col gap-0.5 py-2", contentClassName)}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    layout="position"
                    key={item.id}
                    role="listitem"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -3 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            opacity: { duration: 0.18, ease: EASE_OUT },
                            y: SPRING_LAYOUT,
                            layout: SPRING_LAYOUT,
                          }
                    }
                  >
                    <ActivityRow item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
