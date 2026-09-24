import { type Length, SPACING_TOKENS } from "@digit-ai-studio/shared"
import type { ReactNode } from "react"

import { NumberField, SelectField } from "@/components/studio"

const CUSTOM = "__custom"
const tokenOptions = [
  ...Object.entries(SPACING_TOKENS).map(([token, px]) => ({ value: token, label: `${token.replace("spacing-", "")} · ${px}px` })),
  { value: CUSTOM, label: "Valeur libre ⚠" },
]

/** Spacing value: a design token by default, or a raw px value flagged as off-token. */
export function LengthField({ prefix, value, onChange }: { prefix: ReactNode; value: Length | undefined; onChange: (v: Length) => void }) {
  if (typeof value === "number") {
    return (
      <div className="flex gap-1">
        <NumberField prefix={prefix} value={value} min={0} onCommit={onChange} />
        <SelectField value={CUSTOM} options={tokenOptions} onChange={(v) => v !== CUSTOM && onChange({ token: v })} />
      </div>
    )
  }
  return (
    <SelectField
      prefix={prefix}
      value={value?.token}
      options={tokenOptions}
      onChange={(v) => onChange(v === CUSTOM ? (value ? SPACING_TOKENS[value.token as keyof typeof SPACING_TOKENS] ?? 0 : 0) : { token: v })}
    />
  )
}
