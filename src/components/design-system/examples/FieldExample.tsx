import source from "./FieldExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import { RiErrorWarningLine } from "@remixicon/react"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <FieldGroup className="w-full max-w-xs">
      <Field data-invalid={options.state === "invalid"}>
        <FieldLabel htmlFor={id}>Adresse e-mail</FieldLabel>
        <Input
          id={id}
          type="email"
          placeholder="vous@exemple.fr"
          aria-invalid={options.state === "invalid"}
          disabled={options.state === "disabled"}
          aria-describedby={`${id}-help`}
        />
        <FieldDescription id={`${id}-help`}>
          Utilisée uniquement pour votre compte.
        </FieldDescription>
        {options.state === "invalid" && (
          <FieldError>
            <RiErrorWarningLine />
            Saisissez une adresse e-mail valide.
          </FieldError>
        )}
      </Field>
    </FieldGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
