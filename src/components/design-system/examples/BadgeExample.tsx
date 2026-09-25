import source from "./BadgeExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiCheckboxCircleLine } from "@remixicon/react"
import { Badge } from "@/components/ui/badge"

export function BadgeExample({ options }: ExampleProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Badge
        variant={options.variant as ComponentProps<typeof Badge>["variant"]}
      >
        <RiCheckboxCircleLine data-icon="inline-start" />
        Publié
      </Badge>
      <Badge
        variant={options.variant as ComponentProps<typeof Badge>["variant"]}
      >
        Brouillon
      </Badge>
      <Badge
        variant={options.variant as ComponentProps<typeof Badge>["variant"]}
      >
        12 éléments
      </Badge>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
