import { RiPlayLine, RiStopLine } from "@remixicon/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { IconButton } from "@/components/shared/IconButton"

export function EditorPreviewButton() {
  const editor = useEditor()
  const preview = useEditorState((state) => state.mode === "preview")
  return (
    <IconButton
      label={preview ? "Quitter l’aperçu · Échap" : "Aperçu · ⇧P"}
      active={preview}
      onClick={() => {
        editor.commit()
        editor.set({ mode: preview ? "edit" : "preview", editingTextId: null })
      }}
    >
      {preview ? <RiStopLine /> : <RiPlayLine />}
    </IconButton>
  )
}
