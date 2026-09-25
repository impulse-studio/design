import { useEffect, useRef } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useEditSession } from "./edit-session"

type GestureOptions<TElement extends HTMLElement> = {
  onBegin?: (event: ReactPointerEvent<TElement>) => void
  onMove: (event: ReactPointerEvent<TElement>) => void
  onCommit?: (event: ReactPointerEvent<TElement>) => void
  onCancel?: () => void
}

export const usePointerEditGesture = <TElement extends HTMLElement>({
  onBegin,
  onMove,
  onCommit,
  onCancel,
}: GestureOptions<TElement>) => {
  const session = useEditSession()
  const active = useRef<{ pointerId: number; stop: () => void } | null>(null)

  const finish = (commit: boolean, event?: ReactPointerEvent<TElement>) => {
    const gesture = active.current
    if (!gesture) return false
    active.current = null
    gesture.stop()
    if (commit) {
      session.commit()
      if (event) onCommit?.(event)
    } else {
      session.cancel()
      onCancel?.()
    }
    return true
  }

  useEffect(
    () => () => {
      if (active.current) finish(false)
    },
    [session]
  )

  return {
    active,
    onPointerDown: (event: ReactPointerEvent<TElement>) => {
      if (event.button !== 0 || active.current) return
      event.preventDefault()
      session.begin()
      const cancel = (windowEvent: Event) => {
        if (
          !(windowEvent instanceof KeyboardEvent) ||
          windowEvent.key === "Escape"
        )
          finish(false)
      }
      window.addEventListener("keydown", cancel)
      window.addEventListener("blur", cancel)
      active.current = {
        pointerId: event.pointerId,
        stop: () => {
          window.removeEventListener("keydown", cancel)
          window.removeEventListener("blur", cancel)
        },
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      onBegin?.(event)
    },
    onPointerMove: (event: ReactPointerEvent<TElement>) => {
      if (active.current?.pointerId === event.pointerId) onMove(event)
    },
    onPointerUp: (event: ReactPointerEvent<TElement>) => {
      finish(true, event)
    },
    onPointerCancel: () => finish(false),
    onLostPointerCapture: () => finish(false),
  }
}
