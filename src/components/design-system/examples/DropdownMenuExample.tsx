import source from "./DropdownMenuExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  RiArchiveLine,
  RiArrowDownSLine,
  RiFileCopyLine,
  RiPencilLine,
} from "@remixicon/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
        <RiArrowDownSLine data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              toast.add({
                title: "Renommer",
                description: "Action de démonstration.",
              })
            }
          >
            <RiPencilLine />
            Renommer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              toast.add({
                title: "Projet dupliqué",
                description: "Action de démonstration.",
              })
            }
          >
            <RiFileCopyLine />
            Dupliquer
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              toast.add({
                title: "Projet archivé",
                description: "Action de démonstration.",
              })
            }
          >
            <RiArchiveLine />
            Archiver
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// @example:end

export const getCode = createExampleCode(source)
