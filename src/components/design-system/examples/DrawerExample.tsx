import source from "./DrawerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function DrawerExample() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Ouvrir le panneau
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Votre espace de travail</DrawerTitle>
            <DrawerDescription>
              Retrouvez vos projets et vos préférences.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-6">
            <p className="body-copy text-[13px] leading-[1.55]">
              Une surface qui reste à portée de main, sur tous les écrans.
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button />}>Terminer</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
// @example:end

export const getCode = createExampleCode(source)
