import source from "./AccordionExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export function AccordionExample() {
  return (
    <Accordion className="w-full max-w-md" defaultValue={["one"]}>
      <AccordionItem value="one">
        <AccordionTrigger>Comment utiliser un composant ?</AccordionTrigger>
        <AccordionContent>
          Copiez l’exemple, importez le composant et choisissez ses variantes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Le mode sombre est-il inclus ?</AccordionTrigger>
        <AccordionContent>
          Chaque composant utilise les mêmes tokens sémantiques dans les deux
          thèmes.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
// @example:end

export const getCode = createExampleCode(source)
