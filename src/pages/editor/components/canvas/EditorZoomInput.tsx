import { useState } from "react"
import { Input } from "@/components/ui/input"
import { clampNumber, parseNumberExpression } from "@/lib/number-expression"

export function EditorZoomInput({
  zoom,
  onCommit,
}: {
  zoom: number
  onCommit: (zoom: number) => void
}) {
  const [value, setValue] = useState(String(Math.round(zoom * 100)))
  return (
    <form
      className="editor-zoom-input relative m-1 [&_input]:h-[28px] [&_input]:pr-[26px] [&_input]:text-[12px] [&_>_span]:absolute [&_>_span]:right-[10px] [&_>_span]:top-[50%] [&_>_span]:-translate-y-1/2 [&_>_span]:pointer-events-none [&_>_span]:text-muted-foreground"
      onSubmit={(event) => {
        event.preventDefault()
        const parsed = parseNumberExpression(value)
        if (parsed !== null) onCommit(clampNumber(parsed, 5, 400) / 100)
        else setValue(String(Math.round(zoom * 100)))
      }}
    >
      <Input
        aria-label="Zoom en pourcentage"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Escape") event.stopPropagation()
        }}
      />
      <span aria-hidden="true">%</span>
    </form>
  )
}
