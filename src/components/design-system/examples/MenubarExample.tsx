import source from "./MenubarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarShortcut,
} from "@/components/ui/menubar"
import { toast } from "@/components/ui/toast"

export function MenubarExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Fichier</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem
              onClick={() =>
                toast.add({
                  title: "Nouveau projet",
                  description: "Action de démonstration.",
                })
              }
            >
              Nouveau projet<MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => toast.add({ title: "Projet enregistré" })}
            >
              Enregistrer<MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Affichage</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem onClick={() => toast.add({ title: "Zoom à 100 %" })}>
              Taille réelle
            </MenubarItem>
            <MenubarItem onClick={() => toast.add({ title: "Vue ajustée" })}>
              Ajuster à l’écran
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
// @example:end

export const getCode = createExampleCode(source)
