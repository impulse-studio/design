import source from "./FilterBarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import { RiGridLine, RiListUnordered } from "@remixicon/react"
import { FilterBar } from "@/components/shared/FilterBar"
import { SearchField } from "@/components/shared/SearchField"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function FilterBarExample({ options }: ExampleProps) {
  const [query, setQuery] = useState("")
  return (
    <div className="w-full">
      <FilterBar
        density={options.variant as "compact" | "comfortable"}
        actions={
          <ToggleGroup defaultValue={["grid"]} aria-label="Affichage">
            <ToggleGroupItem value="grid" aria-label="Grille">
              <RiGridLine />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Liste">
              <RiListUnordered />
            </ToggleGroupItem>
          </ToggleGroup>
        }
      >
        <SearchField value={query} onValueChange={setQuery} />
      </FilterBar>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
