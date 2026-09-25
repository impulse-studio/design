import { useEffect, useRef } from "react"
import { useEditSession } from "./edit-session"

export const useContinuousEdit = () => {
  const session = useEditSession()
  const active = useRef(false)
  const finish = (commit: boolean) => {
    if (!active.current) return
    active.current = false
    if (commit) session.commit()
    else session.cancel()
  }

  useEffect(() => () => finish(false), [session])

  return {
    update: (apply: () => void) => {
      if (!active.current) {
        active.current = true
        session.begin()
      }
      apply()
    },
    commit: () => finish(true),
    cancel: () => finish(false),
  }
}
