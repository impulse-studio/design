import source from "./DatePickerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import { DatePicker } from "@/components/shared/DatePicker"

export function DatePickerExample({ options }: ExampleProps) {
  const [date, setDate] = useState<Date | undefined>()
  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
      disabled={options.state === "disabled"}
      label="Date de livraison"
    />
  )
}
// @example:end

export const getCode = createExampleCode(source)
