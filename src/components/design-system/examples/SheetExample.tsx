import source from "./SheetExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { RiArrowRightLine } from "@remixicon/react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Détails du projet
        <RiArrowRightLine data-icon="inline-end" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bibliothèque Digit</SheetTitle>
          <SheetDescription>Informations du projet</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 p-6">
          <Badge variant="secondary">Actif</Badge>
          <p className="body-copy text-[13px] leading-[1.55]">
            Les composants et fondations pour des interfaces cohérentes.
          </p>
          <Separator />
          <div className="flex justify-between">
            <span>Visibilité</span>
            <span className="body-copy text-[13px] leading-[1.55]">Équipe</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
// @example:end

export const getCode = createExampleCode(source)
