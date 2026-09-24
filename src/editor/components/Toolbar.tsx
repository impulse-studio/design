import { RiArrowGoBackLine, RiArrowGoForwardLine, RiCursorLine, RiHand, type RemixiconComponentType } from "@remixicon/react"

import { IconButton } from "@/components/studio"

import { type Tool, TOOLS } from "../constants"
import { useEditor, useEditorActions } from "../context"

const TOOL_ICONS: Record<Tool, RemixiconComponentType> = { move: RiCursorLine, hand: RiHand }

/** Floating bottom toolbar, like Figma's. */
export function Toolbar() {
  const tool = useEditor((s) => s.tool)
  const canUndo = useEditor((s) => s.past.length > 0)
  const canRedo = useEditor((s) => s.future.length > 0)
  const { setTool, undo, redo } = useEditorActions()

  return (
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl border bg-background p-1.5 shadow-lg">
      {TOOLS.map((t) => (
        <IconButton
          key={t.id}
          icon={TOOL_ICONS[t.id]}
          label={`${t.label} (${t.shortcut})`}
          active={tool === t.id}
          onClick={() => setTool(t.id)}
        />
      ))}
      <span className="mx-1 h-5 w-px bg-border" />
      <IconButton icon={RiArrowGoBackLine} label="Annuler (⌘Z)" disabled={!canUndo} onClick={undo} />
      <IconButton icon={RiArrowGoForwardLine} label="Rétablir (⇧⌘Z)" disabled={!canRedo} onClick={redo} />
    </div>
  )
}
