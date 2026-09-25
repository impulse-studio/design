import source from "./TextareaExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

export function TextareaExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor={id}>Description</FieldLabel>
      <Textarea
        id={id}
        placeholder="Décrivez ce que vous souhaitez créer…"
        disabled={options.state === "disabled"}
        aria-invalid={options.state === "invalid"}
        aria-describedby={`${id}-help`}
      />
      <FieldDescription id={`${id}-help`}>
        {options.state === "invalid"
          ? "La description est requise."
          : "Quelques lignes pour partager le contexte."}
      </FieldDescription>
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
