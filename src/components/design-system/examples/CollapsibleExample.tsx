import source from "./CollapsibleExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { RiArrowRightSLine } from "@remixicon/react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export function CollapsibleExample() {
  return (
    <Collapsible className="w-full max-w-xs">
      <CollapsibleTrigger render={<Button variant="ghost" />}>
        <RiArrowRightSLine data-icon="inline-start" />
        Fichiers du projet · 3
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 p-3 pl-7">
          {["Fondations", "Composants", "Documentation"].map((name) => (
            <p key={name} className="body-copy text-[13px] leading-[1.55]">
              {name}
            </p>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
// @example:end

export const getCode = createExampleCode(source)
