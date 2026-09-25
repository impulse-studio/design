import source from "./ContextMenuExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"
import { useState } from "react"
import { AnimatedContextMenuContent } from "@/components/shared/motion/AnimatedContextMenuContent"
import { AnimatedContextMenuItem } from "@/components/shared/motion/AnimatedContextMenuItem"
import { toast } from "@/components/ui/toast"

export function ContextMenuExample() {
  const [pinned, setPinned] = useState(false)
  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="flex h-36 w-full max-w-sm items-center justify-center rounded-lg border border-dashed p-6"
        tabIndex={0}
      >
        <p className="body-copy text-[13px] leading-[1.55] text-center">
          Clic droit, appui long ou touche Menu
        </p>
      </ContextMenuTrigger>
      <AnimatedContextMenuContent>
        <ContextMenuGroup>
          {["Ouvrir", "Dupliquer", "Archiver"].map((action) => (
            <AnimatedContextMenuItem
              key={action}
              onClick={() =>
                toast.add({
                  title: action,
                })
              }
            >
              {action}
            </AnimatedContextMenuItem>
          ))}
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={pinned}
          onCheckedChange={setPinned}
          closeOnClick={false}
        >
          Épingler
        </ContextMenuCheckboxItem>
        <AnimatedContextMenuItem disabled>Partager</AnimatedContextMenuItem>
        <ContextMenuSeparator />
        <AnimatedContextMenuItem
          variant="destructive"
          onClick={() => toast.add({ title: "Supprimé" })}
        >
          Supprimer
        </AnimatedContextMenuItem>
      </AnimatedContextMenuContent>
    </ContextMenu>
  )
}
// @example:end

export const getCode = createExampleCode(source)
