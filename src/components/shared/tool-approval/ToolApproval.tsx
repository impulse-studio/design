"use client"
// beui.dev/components/agents/tool-approval

import {
  RiCheckLine as Check,
  RiArrowDownSLine as ChevronDown,
  RiErrorWarningLine as CircleAlert,
  RiLoader4Line as LoaderCircle,
  RiShieldCheckLine as ShieldCheck,
  RiCloseLine as X,
} from "@remixicon/react"
import { motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { EASE_OUT, SPRING_SWAP } from "@/lib/motion"
import { getStatusCopy } from "./status"
import type { ToolApprovalProps } from "./types"
import { cn } from "@/lib/utils"

export function ToolApproval({
  tool,
  title = "Autoriser cet outil ?",
  description,
  parameters = [],
  status = "pending",
  open,
  defaultOpen = false,
  onOpenChange,
  onApprove,
  onAlwaysAllow,
  onDeny,
  className,
}: ToolApprovalProps) {
  const reduce = useReducedMotion() ?? false
  const baseId = useId()
  const detailsId = `${baseId}-details`
  const previousStatus = useRef(status)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const currentOpen = open ?? internalOpen
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open]
  )
  const busy = status === "approving" || status === "running"
  const pending = status === "pending"
  const error = status === "error"

  useEffect(() => {
    if (previousStatus.current === "pending" && status !== "pending") {
      setOpen(false)
    }
    previousStatus.current = status
  }, [setOpen, status])

  return (
    <Collapsible
      open={currentOpen}
      onOpenChange={setOpen}
      data-state={status}
      aria-busy={busy}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20 text-sm",
        className
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-border/60 bg-background text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {busy ? (
            <LoaderCircle className={cn("size-4", !reduce && "animate-spin")} />
          ) : error ? (
            <CircleAlert className="size-4" />
          ) : status === "denied" ? (
            <X className="size-4" />
          ) : status === "approved" || status === "complete" ? (
            <Check className="size-4" />
          ) : (
            <ShieldCheck className="size-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-medium text-foreground">{title}</div>
              <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                {tool}
              </div>
            </div>
            <Badge
              variant={error || status === "denied" ? "destructive" : "outline"}
              role="status"
            >
              {getStatusCopy(status)}
            </Badge>
          </div>
          {description ? (
            <p className="mt-2 leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}

          {parameters.length ? (
            <CollapsibleTrigger
              render={<Button variant="ghost" size="sm" />}
              type="button"
              aria-expanded={currentOpen}
              aria-controls={detailsId}
              className="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              Voir les détails
              <motion.span
                aria-hidden="true"
                animate={{ rotate: currentOpen ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : SPRING_SWAP}
              >
                <ChevronDown className="size-3.5" />
              </motion.span>
            </CollapsibleTrigger>
          ) : null}
        </div>
      </div>

      <CollapsibleContent id={detailsId}>
        <dl className="mx-4 mb-4 grid gap-2 rounded-xl border border-border/50 bg-background/70 p-3">
          {parameters.map((parameter) => (
            <div
              key={parameter.id}
              className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3 text-xs"
            >
              <dt className="text-muted-foreground">{parameter.label}</dt>
              <dd className="min-w-0 font-mono break-words text-foreground/85">
                {parameter.value}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>

      {pending ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
          className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3"
        >
          <Button
            size="sm"
            type="button"
            disabled={!onApprove}
            onClick={onApprove}
            className="rounded-xl"
          >
            Autoriser une fois
          </Button>
          {onAlwaysAllow ? (
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={onAlwaysAllow}
              className="rounded-xl"
            >
              Toujours autoriser
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            disabled={!onDeny}
            onClick={onDeny}
            className="rounded-xl"
          >
            Refuser
          </Button>
        </motion.div>
      ) : null}
    </Collapsible>
  )
}
