import source from "./ButtonGroupExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

export function ButtonGroupExample() {
  const [zoom, setZoom] = useState(100)
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={() => setZoom(Math.max(25, zoom - 25))}
        aria-label="Réduire le zoom"
      >
        <RiSubtractLine />
      </Button>
      <Button variant="outline" onClick={() => setZoom(100)}>
        {zoom} %
      </Button>
      <Button
        variant="outline"
        onClick={() => setZoom(Math.min(400, zoom + 25))}
        aria-label="Augmenter le zoom"
      >
        <RiAddLine />
      </Button>
    </ButtonGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
