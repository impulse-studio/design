import { useState } from "react"
import { EditorZoomInput } from "./EditorZoomInput"
import { RiArrowDownSLine } from "@remixicon/react"
import { motion, useTransform } from "motion/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"

export function EditorZoomMenu({
  fit,
  zoomTo,
}: {
  fit: (selected?: boolean) => void
  zoomTo: (zoom: number) => void
}) {
  const editor = useEditor()
  const zoomLabel = useTransform(editor.canvas.viewport, (v) => `${Math.round(v.zoom * 100)}%`)
  const [open, setOpen] = useState(false)
  const zoom = useEditorState((state) => state.viewport.zoom)
  const selected = useEditorState((state) => state.selectedIds.length)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="editor-zoom-menu h-[24px] [padding:0_6px] gap-1 text-[11px] font-normal tabular-nums [&_svg]:w-[12px] [&_svg]:h-[12px]"
            aria-label="Zoom et options d’affichage"
          />
        }
      >
        <motion.span>{zoomLabel}</motion.span>
        <RiArrowDownSLine data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-60">
        <EditorZoomInput
          key={open ? "open" : "closed"}
          zoom={zoom}
          onCommit={(next) => {
            zoomTo(next)
            setOpen(false)
          }}
        />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={zoom >= 4}
            onClick={() => zoomTo(zoom * 1.25)}
          >
            Zoom avant<DropdownMenuShortcut>+</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={zoom <= 0.05}
            onClick={() => zoomTo(zoom / 1.25)}
          >
            Zoom arrière<DropdownMenuShortcut>−</DropdownMenuShortcut>
          </DropdownMenuItem>
          {[0.5, 1, 2].map((value) => (
            <DropdownMenuItem key={value} onClick={() => zoomTo(value)}>
              {value * 100}%
              {value === 1 && <DropdownMenuShortcut>⇧0</DropdownMenuShortcut>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => fit()}>
            Tout afficher<DropdownMenuShortcut>⇧1</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!selected} onClick={() => fit(true)}>
            Afficher la sélection<DropdownMenuShortcut>⇧2</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
