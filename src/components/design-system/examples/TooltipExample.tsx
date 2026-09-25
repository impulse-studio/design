import source from "./TooltipExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiCheckLine, RiLinkM } from "@remixicon/react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function TooltipExample() {
  const [copied, setCopied] = useState(false)
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Copier le lien"
            onClick={() => setCopied(!copied)}
          />
        }
      >
        {copied ? <RiCheckLine /> : <RiLinkM />}
      </TooltipTrigger>
      <TooltipContent>
        {copied
          ? "Action de démonstration effectuée"
          : "Copier le lien du projet"}
      </TooltipContent>
    </Tooltip>
  )
}
// @example:end

export const getCode = createExampleCode(source)
