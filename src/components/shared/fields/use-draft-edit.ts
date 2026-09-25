import { useEffect, useRef, useState } from "react"
import type { FocusEvent, KeyboardEvent } from "react"
import { useEditSession } from "./edit-session"

export const INVALID_DRAFT = Symbol("invalid-draft")

/**
 * Text draft for a value edited as one undo step: focus opens the session,
 * blur or Enter commits the parsed draft, Escape restores the initial value.
 */
export const useDraftEdit = <
  TValue,
  TParsed,
  TElement extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  value,
  format,
  parse,
  apply,
  identity,
  selectOnFocus = true,
}: {
  value: TValue
  format: (value: TValue) => string
  parse: (draft: string, initial: TValue) => TParsed | typeof INVALID_DRAFT
  /** Applies a committed value and returns the value to display. */
  apply: (next: TParsed) => TValue
  identity?: unknown
  selectOnFocus?: boolean
}) => {
  const session = useEditSession(),
    text = format(value)
  const [draft, setDraft] = useState(text)
  const [invalid, setInvalid] = useState(false)
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
    if (!focused.current) {
      setDraft(text)
      setInvalid(false)
    }
  }, [text])
  useEffect(() => {
    if (!focused.current) return
    session.cancel()
    initial.current = value
    setDraft(text)
    setInvalid(false)
    session.begin()
  }, [identity])
  const restore = () => setDraft(format(initial.current))
  return {
    draft,
    setDraft: (next: string) => {
      setDraft(next)
      setInvalid(false)
    },
    invalid,
    initial,
    onFocus: (event: FocusEvent<TElement>) => {
      focused.current = true
      canceled.current = false
      initial.current = value
      session.begin()
      if (selectOnFocus) event.currentTarget.select()
    },
    onBlur: () => {
      focused.current = false
      if (canceled.current) {
        canceled.current = false
        return
      }
      const next = parse(draft, initial.current)
      if (next === INVALID_DRAFT) {
        setInvalid(true)
        session.cancel()
        restore()
      } else {
        setInvalid(false)
        setDraft(format(apply(next)))
        session.commit()
      }
    },
    onKeyDown: (event: KeyboardEvent<TElement>) => {
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
        setInvalid(false)
        event.currentTarget.blur()
      }
    },
  }
}
