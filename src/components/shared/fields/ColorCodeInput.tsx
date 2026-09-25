import { Input } from "@/components/ui/input"
import { formatColor, parseColorInput } from "@/lib/colors"
import type { ColorFormat, RGBA } from "@/lib/colors"
import { useDraftEdit } from "./use-draft-edit"

export function ColorCodeInput({
  color,
  format,
  onChange,
  label,
}: {
  color: RGBA
  format: ColorFormat
  onChange: (color: RGBA) => void
  label: string
}) {
  const edit = useDraftEdit({
    value: color,
    format: (value) => formatColor(value, format),
    parse: (draft, initial) => parseColorInput(draft, format, initial.a),
    apply: (next) => {
      onChange(next)
      return next
    },
  })
  return (
    <Input
      aria-label={label}
      aria-invalid={parseColorInput(edit.draft, format, 1) === null}
      className="editor-color-code"
      autoComplete="off"
      spellCheck={false}
      value={edit.draft}
      onFocus={edit.onFocus}
      onChange={(event) => {
        const next = event.target.value
        edit.setDraft(next)
        const parsed = parseColorInput(next, format, edit.initial.current.a)
        if (parsed) onChange(parsed)
      }}
      onBlur={edit.onBlur}
      onKeyDown={edit.onKeyDown}
    />
  )
}
