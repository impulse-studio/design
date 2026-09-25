import {
  RiCursorLine,
  RiArtboard2Line,
  RiRectangleLine,
  RiText,
  RiHand,
  RiApps2AddLine,
} from "@remixicon/react"
import { FRAME_PRESETS } from "@digit-ai-studio/shared"
import type { FramePreset } from "@digit-ai-studio/shared"
import { useEditor, useEditorState } from "@/features/editor/context"
import { ToggleGroup } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { IconButton } from "@/components/shared/IconButton"
import { EditorIsland } from "@/components/shared/EditorIsland"
import { EditorToolGroup } from "./EditorToolGroup"
import { EditorModeSwitch } from "./EditorModeSwitch"
import type { Tool } from "@/features/editor/types"
import { addAutoLayoutToSelection } from "@/features/editor/auto-layout"

export function EditorToolbar({
  compact = false,
  openLibrary,
}: {
  compact?: boolean
  openLibrary?: () => void
}) {
  const editor = useEditor()
  const tool = useEditorState((state) => state.tool)
  const inspect = useEditorState((state) => state.rightTab === "inspect")
  const selectTool = (value: Tool) => editor.set({ tool: value, mode: "edit" })
  const addAutoLayout = () => addAutoLayoutToSelection(editor)
  return (
    <EditorIsland
      className={
        compact
          ? "max-w-[calc(100%-1rem)] overflow-x-auto overscroll-x-contain"
          : undefined
      }
      label="Outils de dessin"
      mode={inspect ? "inspect" : "design"}
    >
      <ToggleGroup
        value={[tool]}
        spacing={2}
        aria-label="Outil actif"
        onValueChange={(values) => {
          const next = values[0] as Tool | undefined
          if (next) selectTool(next)
        }}
      >
        <EditorToolGroup
          value={tool === "hand" ? "hand" : "move"}
          label={tool === "hand" ? "Main · H" : "Sélection · V"}
          options={[
            {
              label: "Déplacer",
              shortcut: "V",
              onSelect: () => selectTool("move"),
            },
            {
              label: "Main",
              shortcut: "H",
              onSelect: () => selectTool("hand"),
            },
          ]}
        >
          {tool === "hand" ? <RiHand /> : <RiCursorLine />}
        </EditorToolGroup>
        {!inspect && (
          <>
            <EditorToolGroup
              value="frame"
              label="Frame · F"
              options={[
                {
                  label: "Dessiner une frame",
                  shortcut: "F",
                  onSelect: () => selectTool("frame"),
                },
                ...Object.entries(FRAME_PRESETS).map(([key, preset]) => ({
                  label: preset.label,
                  shortcut: `${preset.width} × ${preset.height}`,
                  onSelect: () => editor.addFrame(key as FramePreset),
                })),
              ]}
            >
              <RiArtboard2Line />
            </EditorToolGroup>
            <EditorToolGroup
              value="box"
              label="Conteneur · R"
              options={[
                {
                  label: "Conteneur",
                  shortcut: "R",
                  onSelect: () => selectTool("box"),
                },
                {
                  label: "Ajouter un auto-layout",
                  shortcut: "⇧A",
                  onSelect: addAutoLayout,
                },
              ]}
            >
              <RiRectangleLine />
            </EditorToolGroup>
            <EditorToolGroup value="text" label="Texte · T">
              <RiText />
            </EditorToolGroup>
          </>
        )}
      </ToggleGroup>
      {!inspect && (
        <IconButton
          label="Insérer un composant · I"
          onClick={() => {
            if (openLibrary) openLibrary()
            else editor.set({ tab: "components", libraryVisible: true })
          }}
        >
          <RiApps2AddLine />
        </IconButton>
      )}
      <Separator orientation="vertical" className="editor-island-divider h-[48px] -my-2 shrink-0 bg-border" />
      <EditorModeSwitch />
    </EditorIsland>
  )
}
