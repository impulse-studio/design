import {
  RiArrowDownSLine,
  RiCodeSSlashLine,
  RiLockLine,
} from "@remixicon/react"
import { FRAME_PRESETS, nodeLabel } from "@digit-ai-studio/shared"
import type { FramePreset } from "@digit-ai-studio/shared"
import { useSelection } from "@/features/editor/use-selection"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/shared/IconButton"

const labels = {
  image: "Image",
  frame: "Frame",
  box: "Conteneur",
  text: "Texte",
  component: "Composant",
  template: "Template",
  element: "Élément",
}

export function InspectorSelectionHeader() {
  const { nodes, disabled, editor, apply } = useSelection()
  const frames = nodes.every((node) => node.type === "frame")
  const label =
    nodes.length === 1 ? labels[nodes[0].type] : `${nodes.length} éléments`
  return (
    <div
      className="editor-selection-heading flex items-center gap-1.75 py-2 pr-3 pl-4 text-[13px] font-medium h-[48px] [&_>_svg]:w-[15px] [&_>_svg]:h-[15px] [&_h2]:text-[13px] [&_h2]:font-medium"
      title={nodes.length === 1 ? nodeLabel(nodes[0]) : undefined}
    >
      {frames ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="editor-selection-type h-[28px] gap-1.5 [padding:0_4px] -ml-1 text-[13px] [&_svg]:w-[12px] [&_svg]:h-[12px]"
                disabled={disabled}
                aria-label="Format de la frame"
              />
            }
          >
            {label}
            <RiArrowDownSLine />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-64"
          >
            <DropdownMenuGroup>
              {Object.entries(FRAME_PRESETS).map(([key, preset]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() =>
                    apply((node) => {
                      if (node.type === "frame") {
                        node.width = preset.width
                        node.height = preset.height
                        node.preset = key as FramePreset
                      }
                    })
                  }
                >
                  {preset.label}
                  <DropdownMenuShortcut>
                    {preset.width} × {preset.height}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <h2>{label}</h2>
      )}
      <div className="ml-auto flex items-center gap-1">
        {disabled && <RiLockLine aria-label="Verrouillé" />}
        <IconButton
          label="Ouvrir dans Dev Mode · ⇧D"
          onClick={() => editor.setEditorMode("inspect")}
        >
          <RiCodeSSlashLine />
        </IconButton>
      </div>
    </div>
  )
}
