import source from "./SpinnerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { Spinner } from "@/components/ui/spinner"

export function SpinnerExample() {
  return (
    <div className="flex items-center gap-3">
      <Spinner />
      <span className="body-copy text-[13px] leading-[1.55]">Enregistrement en cours…</span>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
