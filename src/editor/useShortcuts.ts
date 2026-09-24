import { useEffect } from "react"

import { TOOLS } from "./constants"
import { useEditorActions } from "./context"

const isTyping = (e: KeyboardEvent) => Boolean((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]"))

export function useShortcuts() {
  const { undo, redo, deleteSelection, select, setTool } = useEditorActions()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e)) return
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (e.key === "Backspace" || e.key === "Delete") {
        deleteSelection()
      } else if (e.key === "Escape") {
        select(null)
      } else if (!mod) {
        const tool = TOOLS.find((t) => t.shortcut.toLowerCase() === e.key.toLowerCase())
        if (tool) setTool(tool.id)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [undo, redo, deleteSelection, select, setTool])
}
