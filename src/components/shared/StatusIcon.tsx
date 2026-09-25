import { cn } from "cn"
import { motion, useReducedMotion } from "motion/react"
import type { StatusValue } from "@/features/design-system/status"

const statusClasses: Record<StatusValue, string> = {
  backlog: "text-status-backlog",
  todo: "text-status-todo",
  "in-progress": "text-status-progress",
  done: "text-status-done",
  canceled: "text-status-canceled",
  duplicate: "text-status-canceled",
}

export function StatusIcon({
  status,
  progress = 50,
  tone = "semantic",
  label,
  className,
}: {
  status: StatusValue
  progress?: number
  tone?: "semantic" | "neutral"
  label?: string
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const transition = {
    duration: reducedMotion ? 0 : 0.18,
    ease: "easeOut" as const,
  }
  const amount = Math.min(100, Math.max(0, progress))
  const angle = (amount / 100) * Math.PI * 2 - Math.PI / 2
  const x = 8 + 3.75 * Math.cos(angle)
  const y = 8 + 3.75 * Math.sin(angle)
  const filled =
    status === "done" || status === "canceled" || status === "duplicate"
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "size-4 shrink-0 transition-colors duration-180 ease-out motion-reduce:transition-none",
        tone === "neutral" ? "text-muted-foreground" : statusClasses[status],
        className
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <motion.circle
        initial={false}
        animate={{ opacity: status === "backlog" ? 0 : 1 }}
        transition={transition}
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="1.1 2.1"
        initial={false}
        animate={{ opacity: status === "backlog" ? 1 : 0 }}
        transition={transition}
      />
      <motion.circle
        cx="8"
        cy="8"
        r="6"
        fill="currentColor"
        initial={false}
        animate={{ opacity: filled ? 1 : 0 }}
        transition={transition}
      />
      <motion.g
        initial={false}
        animate={{ opacity: status === "in-progress" ? 1 : 0 }}
        transition={transition}
      >
        {amount > 0 &&
          (amount === 100 ? (
            <circle cx="8" cy="8" r="3.75" fill="currentColor" />
          ) : (
            <path
              d={
                "M8 8 L8 4.25 A3.75 3.75 0 " +
                (amount > 50 ? "1" : "0") +
                " 1 " +
                x +
                " " +
                y +
                " Z"
              }
              fill="currentColor"
            />
          ))}
      </motion.g>
      <motion.path
        initial={false}
        animate={{ opacity: status === "done" ? 1 : 0 }}
        transition={transition}
        d="m4.8 8.1 2.05 2.05 4.35-4.4"
        stroke="var(--status-on-fill)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        initial={false}
        animate={{
          opacity: status === "canceled" || status === "duplicate" ? 1 : 0,
        }}
        transition={transition}
        d="m5.6 5.6 4.8 4.8m0-4.8-4.8 4.8"
        stroke="var(--status-on-fill)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}
