import { cn } from "cn"
import { type KeyboardEvent, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react"

const fieldBox =
  "flex h-7 min-w-0 items-center gap-1.5 rounded-md border border-transparent bg-muted px-2 text-xs focus-within:border-primary hover:border-border"

export function FieldRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-2", className)}>{children}</div>
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] text-muted-foreground">{children}</span>
}

type NumberFieldProps = {
  /** Short prefix shown inside the field ("W", "H", "X"…). Dragging it scrubs the value, like Figma. */
  prefix: ReactNode
  value: number | undefined
  placeholder?: string
  min?: number
  step?: number
  disabled?: boolean
  onCommit: (value: number) => void
}

export function NumberField({ prefix, value, placeholder, min, step = 1, disabled, onCommit }: NumberFieldProps) {
  const [draft, setDraft] = useState(value === undefined ? "" : String(value))
  const scrub = useRef<{ startX: number; startValue: number } | null>(null)

  useEffect(() => setDraft(value === undefined ? "" : String(value)), [value])

  const clamp = (n: number) => (min === undefined ? n : Math.max(min, n))

  const commit = () => {
    const parsed = Number(draft)
    if (draft.trim() === "" || Number.isNaN(parsed)) return setDraft(value === undefined ? "" : String(value))
    if (parsed !== value) onCommit(clamp(parsed))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur()
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      const delta = (e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 10 : 1)
      onCommit(clamp((value ?? 0) + delta))
    }
  }

  const onScrubStart = (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    scrub.current = { startX: e.clientX, startValue: value ?? 0 }
  }
  const onScrubMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!scrub.current) return
    setDraft(String(clamp(Math.round(scrub.current.startValue + (e.clientX - scrub.current.startX) * step))))
  }
  const onScrubEnd = () => {
    if (!scrub.current) return
    scrub.current = null
    commit()
  }

  return (
    <label className={cn(fieldBox, disabled && "opacity-50")}>
      <span
        className="cursor-ew-resize text-muted-foreground select-none"
        onPointerDown={onScrubStart}
        onPointerMove={onScrubMove}
        onPointerUp={onScrubEnd}
      >
        {prefix}
      </span>
      <input
        className="w-full min-w-0 bg-transparent outline-none tabular-nums"
        inputMode="decimal"
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
      />
    </label>
  )
}

export function TextField({
  value,
  placeholder,
  onCommit,
}: {
  value: string
  placeholder?: string
  onCommit: (value: string) => void
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  return (
    <label className={fieldBox}>
      <input
        className="w-full min-w-0 bg-transparent outline-none"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== value && onCommit(draft)}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      />
    </label>
  )
}

export type Option<T extends string> = { value: T; label: string; icon?: ReactNode }

export function SelectField<T extends string>({
  value,
  options,
  onChange,
  prefix,
}: {
  value: T | undefined
  options: readonly Option<T>[]
  onChange: (value: T) => void
  prefix?: ReactNode
}) {
  return (
    <label className={fieldBox}>
      {prefix && <span className="text-muted-foreground">{prefix}</span>}
      <select
        className="w-full min-w-0 cursor-pointer bg-transparent outline-none"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {value === undefined && <option value="">—</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | undefined
  options: readonly Option<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex h-7 rounded-md bg-muted p-0.5" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          title={o.label}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1 rounded-[5px] text-xs text-muted-foreground transition-colors [&_svg]:size-3.5",
            o.value === value && "bg-background text-foreground shadow-xs",
          )}
        >
          {o.icon ?? o.label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-4 w-7 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted-foreground/30")}
    >
      <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-all", checked ? "left-3.5" : "left-0.5")} />
    </button>
  )
}
