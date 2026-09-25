import source from "./CarouselExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export function CarouselExample() {
  return (
    <Carousel className="w-full max-w-xs" aria-label="Exemples de projets">
      <CarouselContent>
        {["Fondations", "Composants", "Compositions"].map((title, index) => (
          <CarouselItem key={title}>
            <Card>
              <CardContent className="flex h-32 items-center justify-center">
                <div className="flex flex-col gap-3 text-center">
                  <span className="mono-label font-mono text-[11px]">0{index + 1} / 03</span>
                  <span className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">{title}</span>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="relative mt-4 flex h-8 justify-end gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  )
}
// @example:end

export const getCode = createExampleCode(source)
