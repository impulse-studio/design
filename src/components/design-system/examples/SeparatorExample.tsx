import source from "./SeparatorExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { Separator } from "@/components/ui/separator"

export function SeparatorExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <p className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">Bibliothèque Digit</p>
      <p className="body-copy text-[13px] leading-[1.55]">Les détails font la cohérence.</p>
      <Separator />
      <div className="flex h-4 items-center gap-4">
        <span>Fondations</span>
        <Separator orientation="vertical" />
        <span>Composants</span>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
