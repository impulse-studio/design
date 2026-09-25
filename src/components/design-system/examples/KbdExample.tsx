import source from "./KbdExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="body-copy text-[13px] leading-[1.55]">Rechercher un composant</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="body-copy text-[13px] leading-[1.55]">Fermer une fenêtre</span>
        <Kbd>Échap</Kbd>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
