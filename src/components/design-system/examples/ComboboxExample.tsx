import source from "./ComboboxExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"

export function ComboboxExample({ options }: ExampleProps) {
  const id = useId()
  const items = ["Button", "Card", "Dialog", "Input", "Select", "Tabs"]
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Composant</FieldLabel>
      <Combobox items={items} disabled={options.state === "disabled"}>
        <ComboboxInput
          id={id}
          placeholder="Rechercher un composant…"
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>Aucun composant trouvé.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
