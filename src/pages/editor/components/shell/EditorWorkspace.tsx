import { useState } from "react"
import type { MockupRecord } from "@/features/mockups/types"
import { createEditor } from "@/features/editor/store"
import { EditorShell } from "./EditorShell"
import { EditorProvider } from "./EditorProvider"
import { ChatSessionProvider } from "@/components/shared/chat/ChatSessionProvider"
import { useMockupSessionBaseline } from "@/features/mockups/use-session"

export function EditorWorkspace({
  initial,
  readOnly = false,
}: {
  initial: MockupRecord
  readOnly?: boolean
}) {
  // Loader revalidation must not restart autosave or replace a newer local edit.
  // A new document or a permissions change remounts the workspace via its key.
  const baseline = useMockupSessionBaseline(initial)
  const [editor] = useState(() =>
    createEditor(
      {
        name: baseline.name,
        status: baseline.status,
        doc: baseline.doc,
      },
      readOnly
    )
  )
  return (
    <EditorProvider editor={editor}>
      <ChatSessionProvider key={initial.id} mockupId={initial.id}>
        <EditorShell initial={baseline} />
      </ChatSessionProvider>
    </EditorProvider>
  )
}
