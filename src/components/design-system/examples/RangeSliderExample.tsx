import source from "./RangeSliderExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import { RangeSlider } from "@/components/shared/motion/RangeSlider"
import { Field, FieldLabel } from "@/components/ui/field"

export function RangeSliderExample({ options }: ExampleProps) {
  const [value, setValue] = useState(60)
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel className="flex justify-between">
        Intensité <span className="tabular-nums">{value} %</span>
      </FieldLabel>
      <RangeSlider
        aria-label="Intensité"
        value={value}
        min={0}
        max={100}
        step={10}
        disabled={options.state === "disabled"}
        onValueChange={(next) => setValue(Array.isArray(next) ? next[0] : next)}
      />
    </Field>
  )
}
// @example:end
export const getCode = createExampleCode(source)
