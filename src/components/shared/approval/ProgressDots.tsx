import { motion, useReducedMotion } from "motion/react"
import { SPRING_SWAP } from "@/lib/motion"

export function ProgressDots({
  current,
  ids,
}: {
  current: number
  ids: string[]
}) {
  const reduce = useReducedMotion()
  return (
    <span className="flex gap-1.5">
      <span className="sr-only">
        Question {current + 1} sur {ids.length}
      </span>
      {ids.map((id, index) => (
        <motion.span
          key={id}
          aria-hidden="true"
          initial={{
            scale: index === current ? 1 : 0.75,
            opacity: index <= current ? 1 : 0.35,
          }}
          animate={{
            scale: index === current ? 1 : 0.75,
            opacity: index <= current ? 1 : 0.35,
          }}
          transition={reduce ? { duration: 0 } : SPRING_SWAP}
          className="size-1.5 rounded-full bg-foreground"
        />
      ))}
    </span>
  )
}
