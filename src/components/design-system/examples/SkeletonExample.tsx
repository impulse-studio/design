import source from "./SkeletonExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonExample() {
  return (
    <div
      className="flex w-full max-w-xs flex-col gap-5"
      role="status"
      aria-label="Chargement du contenu"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
