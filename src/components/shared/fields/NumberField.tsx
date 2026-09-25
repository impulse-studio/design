import { useId, useRef } from "react"
import type { ReactNode } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { usePointerEditGesture } from "./use-pointer-edit-gesture"
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
  const id = useId()
  const scrub = useRef<{ x: number; value: number } | null>(null)
  const input = useRef<HTMLDivElement>(null)
  const gesture = usePointerEditGesture<HTMLLabelElement>({
    onBegin: (event) => {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur()
      scrub.current = { x: event.clientX, value: value ?? 0 }
    },
    onMove: (event) => {
      if (!scrub.current) return
      const next =
        scrub.current.value +
        Math.round((event.clientX - scrub.current.x) / 2) *
          stepIncrement(event, step)
      onChange(clampNumber(next, min, max))
    },
    onCommit: (event) => {
      const clicked = scrub.current && Math.abs(event.clientX - scrub.current.x) < 3
      scrub.current = null
      if (clicked) input.current?.querySelector("input")?.focus()
    },
    onCancel: () => {
      scrub.current = null
    },
  })
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
          gesture.onPointerDown(event)
        }}
        onPointerMove={gesture.onPointerMove}
        onPointerUp={gesture.onPointerUp}
        onPointerCancel={gesture.onPointerCancel}
        onLostPointerCapture={gesture.onLostPointerCapture}
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
