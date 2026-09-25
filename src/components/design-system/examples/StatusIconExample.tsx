import source from "./StatusIconExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { StatusIcon } from "@/components/shared/StatusIcon"
import { statusOptions } from "@/features/design-system/status"

export function StatusIconExample({ options }: ExampleProps) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
        {statusOptions.map((status) => (
          <div
            key={status.value}
            className="flex items-center gap-2 text-[13px]"
          >
            <StatusIcon
              status={status.value}
              tone={options.variant === "neutral" ? "neutral" : "semantic"}
            />
            {status.label}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 border-t pt-5">
        <span className="text-xs text-muted-foreground">Progression</span>
        {[0, 25, 50, 75, 100].map((progress) => (
          <StatusIcon
            key={progress}
            status="in-progress"
            progress={progress}
            tone={options.variant === "neutral" ? "neutral" : "semantic"}
            label={progress + " %"}
          />
        ))}
      </div>
    </div>
  )
}
// @example:end
export const getCode = createExampleCode(source)
