import source from "./LabelExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function LabelExample() {
  const id = useId()
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={id}>Adresse e-mail</Label>
      <Input id={id} type="email" placeholder="vous@exemple.fr" />
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
