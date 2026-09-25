import { createContext, useContext } from "react"
import { useSelector } from "@tanstack/react-store"
import type { Editor } from "./store"
import type { EditorState } from "./types"

export const EditorContext = createContext<Editor | null>(null)
export const useEditor = () => {
  const editor = useContext(EditorContext)
  if (!editor) throw new Error("EditorContext manquant")
  return editor
}
export const useEditorState = <T>(selector: (state: EditorState) => T, compare?: (a: T, b: T) => boolean): T =>
  useSelector(useEditor().state, selector, { compare })
