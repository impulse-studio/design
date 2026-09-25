import { MotionConfig, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

export function InterfaceMotion({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: reduce ? 0 : 0.18,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </MotionConfig>
  )
}
