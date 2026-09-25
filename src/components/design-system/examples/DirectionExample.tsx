import source from "./DirectionExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { RiArrowRightLine } from "@remixicon/react"
import { DirectionProvider } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DirectionExample({ options }: ExampleProps) {
  return (
    <DirectionProvider direction={options.variant as "ltr" | "rtl"}>
      <div
        dir={options.variant}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <p className="body-copy text-[13px] leading-[1.55]">
          {options.variant === "rtl"
            ? "ابحث في المكتبة"
            : "Rechercher dans la bibliothèque"}
        </p>
        <Input
          aria-label="Recherche"
          placeholder={options.variant === "rtl" ? "بحث…" : "Rechercher…"}
        />
        <Button variant="outline">
          <RiArrowRightLine data-icon="inline-end" />
          {options.variant === "rtl" ? "متابعة" : "Continuer"}
        </Button>
      </div>
    </DirectionProvider>
  )
}
// @example:end

export const getCode = createExampleCode(source)
