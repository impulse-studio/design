"use client"
// beui.dev/components/agents/todo-list

import { RiArrowDownSLine as ChevronDown } from "@remixicon/react"
import { TodoHeaderIcon } from "./TodoHeaderIcon"
import { TodoStatusIcon } from "./TodoStatusIcon"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type TodoItemStatus =
  "pending" | "in-progress" | "completed" | "cancelled"

export interface TodoItem {
  id: string
  title: ReactNode
  status?: TodoItemStatus
  progress?: number
  detail?: ReactNode
}

export interface TodoListProps {
  items: TodoItem[]
  title?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  collapseOnComplete?: boolean
  maxHeight?: number
  className?: string
  emptyMessage?: string
}

const statusLabel = (status: TodoItemStatus) => {
  if (status === "in-progress") return "En cours"
  if (status === "completed") return "Terminée"
  if (status === "cancelled") return "Annulée"
  return "À faire"
}

export function TodoList({
  items,
  title = "Tâches",
  open,
  defaultOpen = true,
  onOpenChange,
  collapseOnComplete = true,
  maxHeight = 248,
  className,
  emptyMessage = "Aucune tâche",
}: TodoListProps) {
  const reduce = useReducedMotion() ?? false
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const contentId = `${baseId}-content`
  const viewportRef = useRef<HTMLDivElement>(null)
  const previousComplete = useRef(false)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const currentOpen = open ?? internalOpen
  const completed = items.filter((item) => item.status === "completed").length
  const allComplete = items.length > 0 && completed === items.length
  const itemCount = items.length

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open]
  )

  useEffect(() => {
    if (previousComplete.current && !allComplete) {
      setOpen(true)
    }
    if (!previousComplete.current && allComplete && collapseOnComplete) {
      setOpen(false)
    }
    previousComplete.current = allComplete
  }, [allComplete, collapseOnComplete, setOpen])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || itemCount === 0) return

    const frame = requestAnimationFrame(() => {
      if (viewport.scrollHeight <= viewport.clientHeight) return
      if (typeof viewport.scrollTo === "function") {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: reduce ? "auto" : "smooth",
        })
      } else {
        viewport.scrollTop = viewport.scrollHeight
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [itemCount, reduce])

  return (
    <Collapsible
      open={currentOpen}
      onOpenChange={setOpen}
      role="region"
      aria-label="Liste de tâches"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/70",
        className
      )}
    >
      <CollapsibleTrigger
        render={<Button variant="ghost" />}
        id={triggerId}
        type="button"
        aria-expanded={currentOpen}
        aria-controls={contentId}
        className="group flex h-11 w-full items-center gap-2.5 rounded-2xl px-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <TodoHeaderIcon complete={allComplete} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
          {title}
        </span>
        <span
          className={cn(
            "shrink-0 text-xs font-medium text-muted-foreground tabular-nums",
            allComplete && "text-primary"
          )}
        >
          <span className="sr-only">
            {completed} sur {items.length} tâches terminées
          </span>
          <span aria-hidden="true" className="inline-flex">
            <motion.span
              key={completed}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : SPRING_SWAP}
            >
              {completed}
            </motion.span>
            <span>/</span>
            <span>{items.length}</span>
          </span>
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: currentOpen ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING_SWAP}
          className="text-muted-foreground/50 transition-colors group-hover:text-muted-foreground"
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </CollapsibleTrigger>

      <CollapsibleContent
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
      >
        <div
          ref={viewportRef}
          className="scrollbar-hide overflow-y-auto px-2 pb-2"
          style={{ maxHeight }}
        >
          {items.length ? (
            <ol aria-live="polite" className="flex flex-col">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => {
                  const status = item.status ?? "pending"
                  return (
                    <motion.li
                      layout="position"
                      key={item.id}
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
                      className="flex min-h-9 items-center gap-2.5 rounded-xl px-1.5 py-1"
                    >
                      <TodoStatusIcon
                        status={status}
                        progress={item.progress}
                      />
                      <span className="sr-only">{statusLabel(status)}: </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm leading-5",
                          status === "pending" && "text-muted-foreground/65",
                          status === "in-progress" && "text-foreground",
                          status === "completed" && "text-muted-foreground/60",
                          status === "cancelled" && "text-muted-foreground/55"
                        )}
                      >
                        <span className="relative inline-block max-w-full">
                          {item.title}
                          <motion.span
                            aria-hidden="true"
                            initial={false}
                            animate={{
                              scaleX: status === "completed" ? 1 : 0,
                              opacity: status === "completed" ? 1 : 0,
                            }}
                            transition={
                              reduce
                                ? { duration: 0 }
                                : {
                                    duration: 0.28,
                                    ease: EASE_OUT,
                                    delay: 0.06,
                                  }
                            }
                            className="absolute inset-x-0 top-1/2 h-px origin-left bg-current"
                          />
                        </span>
                      </span>
                      {item.detail ? (
                        <span className="shrink-0 text-sm text-muted-foreground/55">
                          {item.detail}
                        </span>
                      ) : null}
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ol>
          ) : (
            <p className="px-1.5 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
