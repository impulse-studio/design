import type { ReactNode } from "react"
import { EditSessionContext } from "@/components/shared/fields/edit-session"
import { EditorContext } from "@/features/editor/context"
import type { Editor } from "@/features/editor/store"

export function EditorProvider({
  editor,
  children,
}: {
  editor: Editor
  children: ReactNode
}) {
  return (
    <EditorContext.Provider value={editor}>
      <EditSessionContext.Provider value={editor}>
        {children}
      </EditSessionContext.Provider>
    </EditorContext.Provider>
  )
}
