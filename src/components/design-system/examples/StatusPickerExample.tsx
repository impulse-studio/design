import source from "./StatusPickerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import type { ComponentProps } from "react"
import { StatusPicker } from "@/components/shared/StatusPicker"
import type { StatusValue } from "@/features/design-system/status"

export function StatusPickerExample({ options }: ExampleProps) {
  const [status, setStatus] = useState<StatusValue>("in-progress")
  return (
    <StatusPicker
      value={status}
      onValueChange={setStatus}
      variant={
        options.variant as ComponentProps<typeof StatusPicker>["variant"]
      }
      disabled={options.state === "disabled"}
    />
  )
}
// @example:end
export const getCode = createExampleCode(source)
