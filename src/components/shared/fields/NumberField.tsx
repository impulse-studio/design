import { useEffect, useId, useRef } from "react"
import type { ReactNode } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { useEditSession } from "./edit-session"
import { NumberInput } from "./NumberInput"
import {
  NUMBER_BOUNDS,
  clampNumber,
  stepIncrement,
} from "@/lib/number-expression"

export function NumberField({
  label,
  value,
  onChange,
  min = NUMBER_BOUNDS.min,
  max = NUMBER_BOUNDS.max,
  step = 1,
  disabled = false,
  prefix,
  placeholder,
}: {
  label: string
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  prefix?: ReactNode
  placeholder?: string
}) {
  const id = useId(),
    editor = useEditSession()
  const scrub = useRef<{ x: number; value: number; stop: () => void } | null>(
    null
  )
  const input = useRef<HTMLDivElement>(null)
  const endScrub = (commit: boolean) => {
    const current = scrub.current
    if (!current) return false
    scrub.current = null
    current.stop()
    if (commit) editor.commit()
    else editor.cancel()
    return true
  }
  useEffect(
    () => () => {
      scrub.current?.stop()
      if (scrub.current) editor.cancel()
    },
    [editor]
  )
  return (
    <Field
      ref={input}
      className="editor-number-field relative flex flex-row items-center gap-1 min-w-0 bg-muted rounded-[5px] pl-2 [&_>_[data-slot=input]]:pl-7 [&_>_[data-slot=input]]:pr-1 [&_>_[data-slot=input]]:tabular-nums [&_>_[data-slot=input]]:text-[11px] [&_>_[data-slot=input]]:w-full [&_>_.editor-scrub-label]:absolute [&_>_.editor-scrub-label]:left-[8px] [&_>_.editor-scrub-label]:text-[9px] [&_>_.editor-scrub-label]:w-auto [&_>_.editor-scrub-label]:cursor-ew-resize [&_>_.editor-scrub-label]:z-[1] [&_>_.editor-scrub-label]:touch-none [&:has(.editor-scrub-label:first-child:last-of-type)_>_.editor-scrub-label]:max-w-[36px] [&:has(.editor-scrub-label:first-child:last-of-type)_>_.editor-scrub-label]:overflow-hidden [&:has(.editor-scrub-label:first-child:last-of-type)_>_.editor-scrub-label]:text-ellipsis [&_>_input[type=number]::-webkit-inner-spin-button]:opacity-[0] [&_>_input[type=number]:focus::-webkit-inner-spin-button]:opacity-[1] [&_.editor-scrub-label]:static [&_.editor-scrub-label]:transform-none [&_.editor-scrub-label]:shrink-0 [&_.editor-scrub-label]:max-w-[70px] [&_.editor-scrub-label]:text-[10px] [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:pl-0.5 [&_input]:text-right"
      data-disabled={disabled || undefined}
    >
      <FieldLabel
        htmlFor={id}
        className="editor-scrub-label"
        onPointerDown={(event) => {
          if (
            disabled ||
            event.button !== 0 ||
            input.current?.closest("fieldset:disabled")
          )
            return
          event.preventDefault()
          if (document.activeElement instanceof HTMLElement)
            document.activeElement.blur()
          editor.begin()
          // Escape or leaving the window cancels the scrub.
          const cancel = (windowEvent: Event) => {
            if (
              !(windowEvent instanceof KeyboardEvent) ||
              windowEvent.key === "Escape"
            )
              endScrub(false)
          }
          window.addEventListener("keydown", cancel)
          window.addEventListener("blur", cancel)
          scrub.current = {
            x: event.clientX,
            value: value ?? 0,
            stop: () => {
              window.removeEventListener("keydown", cancel)
              window.removeEventListener("blur", cancel)
            },
          }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!scrub.current) return
          const next =
            scrub.current.value +
            Math.round((event.clientX - scrub.current.x) / 2) *
              stepIncrement(event, step)
          onChange(clampNumber(next, min, max))
        }}
        onPointerUp={(event) => {
          const clicked =
            scrub.current && Math.abs(event.clientX - scrub.current.x) < 3
          if (endScrub(true) && clicked)
            input.current?.querySelector("input")?.focus()
        }}
        onPointerCancel={() => endScrub(false)}
        onLostPointerCapture={() => endScrub(true)}
      >
        {prefix ? (
          <>
            <span aria-hidden="true">{prefix}</span>
            <span className="sr-only">{label}</span>
          </>
        ) : (
          label
        )}
      </FieldLabel>
      <NumberInput
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Field>
  )
}
