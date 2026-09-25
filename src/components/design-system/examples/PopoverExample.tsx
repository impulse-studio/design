import source from "./PopoverExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useId } from "react"
import { RiEqualizerLine } from "@remixicon/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function PopoverExample() {
  const id = useId()
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <RiEqualizerLine data-icon="inline-start" />
        Dimensions
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <h3 className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">Dimensions du cadre</h3>
          <Field>
            <FieldLabel htmlFor={id}>Largeur en pixels</FieldLabel>
            <Input id={id} type="number" min={1} defaultValue={1440} />
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  )
}
// @example:end

export const getCode = createExampleCode(source)
