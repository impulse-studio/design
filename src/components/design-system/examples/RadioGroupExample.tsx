import source from "./RadioGroupExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"

export function RadioGroupExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend>Accès au projet</FieldLegend>
      <RadioGroup defaultValue="team" disabled={options.state === "disabled"}>
        {[
          ["team", "Toute l’équipe"],
          ["private", "Sur invitation"],
        ].map(([value, label]) => (
          <Field key={value} orientation="horizontal">
            <RadioGroupItem value={value} id={`${id}-${value}`} />
            <FieldLabel htmlFor={`${id}-${value}`}>{label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}
// @example:end

export const getCode = createExampleCode(source)
