import source from "./AspectRatioExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { RiImageLine } from "@remixicon/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioExample() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="rounded-lg border bg-muted">
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <RiImageLine className="size-6 text-muted-foreground" />
          <span className="mono-label font-mono text-[11px]">16 / 9</span>
        </div>
      </AspectRatio>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
