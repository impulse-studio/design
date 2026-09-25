import source from "./SliderExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

export function SliderExample({ options }: ExampleProps) {
  const [value, setValue] = useState(72)
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Opacité</FieldLabel>
      <Slider
        aria-label="Opacité"
        value={value}
        onValueChange={(next) => setValue(Array.isArray(next) ? next[0] : next)}
        min={0}
        max={100}
        step={1}
        disabled={options.state === "disabled"}
      />
      <FieldDescription>{value} %</FieldDescription>
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
