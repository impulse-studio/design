import { useEffect } from "react"
import type { useSiteEditor } from "@/features/sites/use-editor"

type EditorShortcuts = Pick<
  ReturnType<typeof useSiteEditor>,
  "busy" | "undo" | "redo"
>

export function useSiteEditorShortcuts({ busy, undo, redo }: EditorShortcuts) {
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement).closest(
          "input,textarea,select,[contenteditable]"
        )
      )
        return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (!busy) {
          if (event.shiftKey) redo()
          else undo()
        }
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [busy, redo, undo])
}
