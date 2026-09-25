import source from "./SwitchExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import type { ComponentProps } from "react"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from "@/components/ui/field"

export function SwitchExample({ options }: ExampleProps) {
  const id = useId()
  return (
    <Field orientation="horizontal" className="w-full max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor={id}>Sauvegarde automatique</FieldLabel>
        <FieldDescription>
          Vos modifications restent enregistrées.
        </FieldDescription>
      </FieldContent>
      <Switch
        id={id}
        defaultChecked
        size={options.size as ComponentProps<typeof Switch>["size"]}
        disabled={options.state === "disabled"}
      />
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
