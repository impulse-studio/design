import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { RiArrowRightLine } from "@remixicon/react"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  catalogSearchText,
  matchesSearch,
} from "@/features/design-system/search"
import { catalog, categories } from "@/features/design-system/catalog"
import { APP_ROUTES } from "@/constants"

export function CatalogSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onOpenChange])
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rechercher dans la bibliothèque"
      description="Ouvrez un composant, une composition ou une fondation."
    >
      <Command filter={(value, query) => (matchesSearch(value, query) ? 1 : 0)}>
        <CommandInput placeholder="Un composant, une intention…" />
        <CommandList>
          <CommandEmpty>
            Aucun résultat. Essayez « bouton », « formulaire » ou « navigation
            ».
          </CommandEmpty>
          {categories.map((category) => (
            <CommandGroup key={category} heading={category}>
              {catalog
                .filter((entry) => entry.category === category)
                .map((entry) => (
                  <CommandItem
                    key={entry.id}
                    value={catalogSearchText(entry)}
                    onSelect={() => {
                      onOpenChange(false)
                      void navigate({
                        to: APP_ROUTES.designSystemComponent,
                        params: { slug: entry.id },
                      })
                    }}
                  >
                    <span className="flex-1">{entry.name}</span>
                    <RiArrowRightLine />
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
