import { RiCodeSSlashLine, RiPencilRuler2Line } from "@remixicon/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { ModeSwitch } from "@/components/shared/ModeSwitch"

const modes = [
  {
    value: "design",
    label: "Design",
    icon: <RiPencilRuler2Line />,
    shortcut: "⇧D",
  },
  {
    value: "inspect",
    label: "Dev Mode",
    icon: <RiCodeSSlashLine />,
    shortcut: "⇧D",
  },
] as const

export function EditorModeSwitch() {
  const editor = useEditor()
  const mode = useEditorState((state) => state.rightTab)
  return (
    <ModeSwitch
      value={mode}
      ariaLabel="Mode de l’éditeur"
      options={modes.map((item) => ({
        ...item,
        disabled: editor.readOnly && item.value === "design",
      }))}
      onValueChange={editor.setEditorMode}
    />
  )
}
