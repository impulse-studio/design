import { Input } from "@/components/ui/input"
import {
  NUMBER_BOUNDS,
  clampNumber,
  formatNumber,
  parseNumberExpression,
  stepIncrement,
} from "@/lib/number-expression"
import { useDraftEdit } from "./use-draft-edit"

export function NumberInput({
  label,
  value,
  onChange,
  min = NUMBER_BOUNDS.min,
  max = NUMBER_BOUNDS.max,
  step = 1,
  disabled = false,
  id,
  placeholder = "Mixte",
}: {
  label: string
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  id?: string
  placeholder?: string
}) {
  const apply = (next: number) => {
    const number = clampNumber(next, min, max)
    onChange(number)
    return number
  }
  const edit = useDraftEdit({
    value,
    format: formatNumber,
    parse: (draft, initial) => parseNumberExpression(draft, initial),
    apply,
  })
  return (
    <Input
      id={id}
      aria-label={label}
      role="spinbutton"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={value === undefined ? placeholder : undefined}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      controlSize="sm"
      disabled={disabled}
      value={edit.draft}
      placeholder={placeholder}
      onFocus={edit.onFocus}
      onChange={(event) => {
        const text = event.target.value
        edit.setDraft(text)
        // Preview complete literal values while preserving intermediate expressions.
        if (/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text.trim())) {
          const number = parseNumberExpression(text)
          if (number !== null) apply(number)
        }
      }}
      onBlur={edit.onBlur}
      onKeyDown={(event) => {
        edit.onKeyDown(event)
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault()
          const current =
            parseNumberExpression(edit.draft, edit.initial.current) ??
            value ??
            0
          const increment = stepIncrement(event, step)
          edit.setDraft(
            formatNumber(
              apply(
                current + (event.key === "ArrowUp" ? increment : -increment)
              )
            )
          )
        }
      }}
    />
  )
}
