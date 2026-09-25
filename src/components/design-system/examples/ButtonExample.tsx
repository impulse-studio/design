import source from "./ButtonExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiAddLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function ButtonExample({ options }: ExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant={options.variant as ComponentProps<typeof Button>["variant"]}
        size={options.size as ComponentProps<typeof Button>["size"]}
        disabled={options.state === "disabled" || options.state === "loading"}
        aria-busy={options.state === "loading"}
      >
        {options.state === "loading" ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <RiAddLine data-icon="inline-start" />
        )}
        Créer un projet
      </Button>
      <Button variant="ghost" disabled={options.state === "disabled"}>
        Annuler
      </Button>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
