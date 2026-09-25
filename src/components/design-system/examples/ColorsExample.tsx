import source from "./ColorsExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start

export function ColorsExample() {
  const tokens = [
    ["Fond", "background"],
    ["Surface", "surface"],
    ["Atténué", "muted"],
    ["Bordure", "border"],
    ["Secondaire", "muted-foreground"],
    ["Principal", "foreground"],
  ]
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
      {tokens.map(([name, token]) => (
        <div key={name} className="flex flex-col gap-2">
          <div
            className="h-16 rounded-md border"
            style={{ background: `var(--${token})` }}
          />
          <p className="text-xs font-medium">{name}</p>
          <p className="mono-label font-mono text-[11px]">{token}</p>
        </div>
      ))}
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
