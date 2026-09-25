import source from "./MarkerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiCheckLine } from "@remixicon/react"
import { Marker, MarkerIcon, MarkerContent } from "@/components/ui/marker"

export function MarkerExample({ options }: ExampleProps) {
  return (
    <Marker
      className="w-full max-w-sm"
      variant={options.variant as ComponentProps<typeof Marker>["variant"]}
    >
      <MarkerIcon>
        <RiCheckLine />
      </MarkerIcon>
      <MarkerContent>Les modifications ont été enregistrées</MarkerContent>
    </Marker>
  )
}
// @example:end

export const getCode = createExampleCode(source)
