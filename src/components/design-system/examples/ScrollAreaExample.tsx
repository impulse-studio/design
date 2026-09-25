import source from "./ScrollAreaExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ScrollAreaExample() {
  return (
    <ScrollArea
      className="h-52 w-full max-w-xs rounded-lg border"
      tabIndex={0}
      aria-label="Composants disponibles"
    >
      <div className="p-4">
        <p className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em] mb-4">Composants</p>
        {[
          "Button",
          "Input",
          "Select",
          "Card",
          "Dialog",
          "Tabs",
          "Table",
          "Popover",
          "Tooltip",
          "Switch",
          "Badge",
          "Avatar",
        ].map((name) => (
          <div key={name}>
            <p className="body-copy text-[13px] leading-[1.55] py-2">{name}</p>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
// @example:end

export const getCode = createExampleCode(source)
