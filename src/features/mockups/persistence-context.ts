import { createContext, useContext } from "react"

export const EditorPersistenceContext = createContext<{
  waitForSave: () => Promise<void>
} | null>(null)
export const useEditorPersistence = () => {
  const context = useContext(EditorPersistenceContext)
  if (!context) throw new Error("EditorPersistenceContext manquant")
  return context
}
