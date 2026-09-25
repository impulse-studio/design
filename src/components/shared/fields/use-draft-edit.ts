import { useEffect, useRef, useState } from "react"
import type { FocusEvent, KeyboardEvent } from "react"
import { useEditSession } from "./edit-session"

/**
 * Text draft for a value edited as one undo step: focus opens the session,
 * blur or Enter commits the parsed draft, Escape restores the initial value.
 */
export const useDraftEdit = <TValue, TParsed extends TValue>({
  value,
  format,
  parse,
  apply,
}: {
  value: TValue
  format: (value: TValue) => string
  parse: (draft: string, initial: TValue) => TParsed | null
  /** Applies a committed value and returns the value to display. */
  apply: (next: TParsed) => TValue
}) => {
  const session = useEditSession(),
    text = format(value)
  const [draft, setDraft] = useState(text)
  const focused = useRef(false),
    canceled = useRef(false),
    initial = useRef(value)
  useEffect(
    () => () => {
      if (focused.current) session.commit()
    },
    [session]
  )
  useEffect(() => {
    if (!focused.current) setDraft(text)
  }, [text])
  const restore = () => setDraft(format(initial.current))
  return {
    draft,
    setDraft,
    initial,
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      focused.current = true
      canceled.current = false
      initial.current = value
      session.begin()
      event.currentTarget.select()
    },
    onBlur: () => {
      focused.current = false
      if (canceled.current) {
        canceled.current = false
        return
      }
      const next = parse(draft, initial.current)
      if (next === null) {
        session.cancel()
        restore()
      } else {
        setDraft(format(apply(next)))
        session.commit()
      }
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation()
      if (event.nativeEvent.isComposing) return
      if (event.key === "Enter") {
        event.preventDefault()
        event.currentTarget.blur()
      }
      if (event.key === "Escape") {
        event.preventDefault()
        canceled.current = true
        session.cancel()
        restore()
        event.currentTarget.blur()
      }
    },
  }
}
