import { RiSpace } from "@remixicon/react"
import { AlignmentIcon } from "./AlignmentIcon"
import { useEditor, useEditorState } from "@/features/editor/context"
import {
  alignSelection,
  canArrange,
  distributeSelection,
} from "@/features/editor/arrange"
import type { Alignment } from "@/features/editor/arrange"
import { IconButton } from "@/components/shared/IconButton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const alignments: {
  value: Alignment
  label: string
}[] = [
  { value: "left", label: "Aligner à gauche" },
  { value: "center", label: "Centrer horizontalement" },
  { value: "right", label: "Aligner à droite" },
  { value: "top", label: "Aligner en haut" },
  { value: "middle", label: "Centrer verticalement" },
  { value: "bottom", label: "Aligner en bas" },
]
export function AlignmentControls() {
  const editor = useEditor(),
    count = useEditorState((s) => s.selectedIds.length),
    enabled = canArrange(editor)
  return (
    <div
      className="editor-alignment-controls flex justify-between [margin:0] gap-px [&_button]:w-[28px] [&_button]:h-[26px] [&_>_button]:flex-1 [&_>_button]:min-w-0 [&_>_button]:w-[26px] [&_>_button]:h-[24px] [&_>_button]:p-1 [&_>_button]:rounded-none [&_>_button]:bg-muted [&_>_button:first-child]:rounded-[5px [&_>_button:first-child]:0 [&_>_button:first-child]:5px] [&_>_button:nth-child(4)]:rounded-[5px [&_>_button:nth-child(4)]:0 [&_>_button:nth-child(4)]:5px] [&_>_button:nth-child(4)]:ml-1.5 [&_>_button:nth-child(3)]:rounded-[0 [&_>_button:nth-child(3)]:5px [&_>_button:nth-child(3)]:0] [&_>_button:nth-child(6)]:rounded-[0 [&_>_button:nth-child(6)]:5px [&_>_button:nth-child(6)]:0] [&_>_button:last-child]:ml-1 [&_>_button:last-child]:bg-transparent [@media(hover:hover)_and_(pointer:fine)]:[&_>_button:enabled:hover]:bg-accent"
      role="toolbar"
      aria-label="Aligner la sélection"
    >
      {alignments.map(({ value, label }) => (
        <IconButton
          key={value}
          label={label}
          disabled={!enabled}
          onClick={(event) => alignSelection(editor, value, event.shiftKey)}
        >
          <AlignmentIcon alignment={value} />
        </IconButton>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Répartir la sélection"
              disabled={!enabled || count < 3}
            />
          }
        >
          <RiSpace />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px]">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => distributeSelection(editor, "x")}>
              Répartir horizontalement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => distributeSelection(editor, "y")}>
              Répartir verticalement
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
