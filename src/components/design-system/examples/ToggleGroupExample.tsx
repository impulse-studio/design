import source from "./ToggleGroupExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiGridLine, RiListUnordered } from "@remixicon/react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupExample({ options }: ExampleProps) {
  return (
    <ToggleGroup
      aria-label="Affichage"
      defaultValue={["grid"]}
      variant={options.variant as ComponentProps<typeof ToggleGroup>["variant"]}
      size={options.size as ComponentProps<typeof ToggleGroup>["size"]}
    >
      <ToggleGroupItem value="grid" aria-label="Vue grille">
        <RiGridLine />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Vue liste">
        <RiListUnordered />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
