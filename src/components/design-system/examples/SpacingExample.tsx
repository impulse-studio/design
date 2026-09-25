import source from "./SpacingExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start

export function SpacingExample() {
  return (
    <div className="flex w-full flex-col gap-4">
      {[4, 8, 12, 16, 24, 32, 48, 64].map((value) => (
        <div key={value} className="flex items-center gap-6">
          <span className="mono-label font-mono text-[11px] w-10">{value} px</span>
          <div
            className="h-3 rounded-sm bg-foreground"
            style={{ width: value * 3 }}
          />
        </div>
      ))}
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
