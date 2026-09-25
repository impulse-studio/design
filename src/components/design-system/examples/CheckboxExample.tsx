import source from "./CheckboxExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from "@/components/ui/field"

export function CheckboxExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <Field orientation="horizontal" className="w-full max-w-sm">
      <Checkbox
        id={id}
        defaultChecked
        disabled={options.state === "disabled"}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>M’informer des changements</FieldLabel>
        <FieldDescription>
          Recevez un récapitulatif de l’activité.
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
