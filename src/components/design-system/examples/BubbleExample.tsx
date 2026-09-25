import source from "./BubbleExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export function BubbleExample({ options }: ExampleProps) {
  return (
    <BubbleGroup>
      <Bubble
        variant={options.variant as ComponentProps<typeof Bubble>["variant"]}
      >
        <BubbleContent>
          Une bibliothèque cohérente commence par des détails partagés.
        </BubbleContent>
      </Bubble>
      <Bubble
        variant={options.variant as ComponentProps<typeof Bubble>["variant"]}
      >
        <BubbleContent>Prête pour le prochain écran.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
