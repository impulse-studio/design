import source from "./SharedLayoutBackgroundExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { SharedLayoutBg } from "@/components/ui/shared-layout-bg"
import { Button } from "@/components/ui/button"

export function SharedLayoutBackgroundExample() {
  return (
    <SharedLayoutBg className="max-w-xs gap-1" inset={0}>
      {["Accueil", "Bibliothèque", "Équipe"].map((label) => (
        <Button key={label} variant="ghost" className="justify-start">
          {label}
        </Button>
      ))}
    </SharedLayoutBg>
  )
}
// @example:end
export const getCode = createExampleCode(source)
