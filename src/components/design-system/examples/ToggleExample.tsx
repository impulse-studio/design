import source from "./ToggleExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiBold, RiItalic, RiUnderline } from "@remixicon/react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleExample({ options }: ExampleProps) {
  return (
    <div className="flex gap-2">
      <Toggle
        aria-label="Gras"
        variant={options.variant as ComponentProps<typeof Toggle>["variant"]}
        size={options.size as ComponentProps<typeof Toggle>["size"]}
        disabled={options.state === "disabled"}
      >
        <RiBold />
      </Toggle>
      <Toggle
        aria-label="Italique"
        variant={options.variant as ComponentProps<typeof Toggle>["variant"]}
        disabled={options.state === "disabled"}
      >
        <RiItalic />
      </Toggle>
      <Toggle
        aria-label="Souligner"
        variant={options.variant as ComponentProps<typeof Toggle>["variant"]}
        disabled={options.state === "disabled"}
      >
        <RiUnderline />
      </Toggle>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
