import source from "./InputExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import type { ComponentProps } from "react"
import { RiErrorWarningLine } from "@remixicon/react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

export function InputExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <Field
      className="w-full max-w-xs"
      data-invalid={options.state === "invalid"}
    >
      <FieldLabel htmlFor={id}>Nom du projet</FieldLabel>
      <Input
        id={id}
        placeholder="Mon prochain projet"
        controlSize={
          options.size as ComponentProps<typeof Input>["controlSize"]
        }
        disabled={options.state === "disabled"}
        aria-invalid={options.state === "invalid"}
        aria-describedby={`${id}-help`}
      />
      <FieldDescription id={`${id}-help`}>
        Un nom court et facile à retrouver.
      </FieldDescription>
      {options.state === "invalid" && (
        <FieldError>
          <RiErrorWarningLine />
          Le nom du projet est requis.
        </FieldError>
      )}
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
