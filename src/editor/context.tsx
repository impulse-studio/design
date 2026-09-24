import { useSelector } from "@tanstack/react-store"
import { createContext, type ReactNode, useContext } from "react"

import type { EditorState, EditorStore } from "./store"

const EditorStoreContext = createContext<EditorStore | null>(null)

export function EditorProvider({ store, children }: { store: EditorStore; children: ReactNode }) {
  return <EditorStoreContext.Provider value={store}>{children}</EditorStoreContext.Provider>
}

export function useEditorStore(): EditorStore {
  const store = useContext(EditorStoreContext)
  if (!store) throw new Error("useEditorStore must be used inside <EditorProvider>")
  return store
}

/** Pass `shallow` as `compare` when the selector builds a new object or array. */
export function useEditor<T>(selector: (state: EditorState) => T, compare?: (a: T, b: T) => boolean): T {
  return useSelector(useEditorStore(), selector, { compare })
}

export function useEditorActions() {
  return useEditorStore().actions
}
