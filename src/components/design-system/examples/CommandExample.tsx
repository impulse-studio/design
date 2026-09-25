import source from "./CommandExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { RiAddLine, RiBookOpenLine, RiSettings3Line } from "@remixicon/react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import { toast } from "@/components/ui/toast"

export function CommandExample() {
  return (
    <Command className="w-full max-w-sm border">
      <CommandInput placeholder="Rechercher une action…" />
      <CommandList>
        <CommandEmpty>Aucune action trouvée.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              toast.add({
                title: "Créer un projet",
                description: "Action de démonstration.",
              })
            }
          >
            <RiAddLine />
            Créer un projet<CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              toast.add({
                title: "Préférences",
                description: "Action de démonstration.",
              })
            }
          >
            <RiSettings3Line />
            Préférences
          </CommandItem>
          <CommandItem
            onSelect={() =>
              toast.add({
                title: "Documentation",
                description: "Action de démonstration.",
              })
            }
          >
            <RiBookOpenLine />
            Documentation
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
// @example:end

export const getCode = createExampleCode(source)
