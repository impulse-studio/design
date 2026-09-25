import source from "./SelectExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useId } from "react"
import type { ComponentProps } from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

export function SelectExample({ options }: ExampleProps) {
  const id = useId()
  const items = [
    { value: "team", label: "Toute l’équipe" },
    { value: "private", label: "Sur invitation" },
    { value: "public", label: "Tout le monde" },
  ]
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Visibilité</FieldLabel>
      <Select
        items={items}
        defaultValue="team"
        disabled={options.state === "disabled"}
      >
        <SelectTrigger
          id={id}
          variant={
            options.variant as ComponentProps<typeof SelectTrigger>["variant"]
          }
          className="w-full"
          size={options.size as ComponentProps<typeof SelectTrigger>["size"]}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
// @example:end

export const getCode = createExampleCode(source)
