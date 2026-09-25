import { useEditorChat } from "@/features/chat/context"
import { AiEditorChat } from "./AiEditorChat"
import { EditorDemoChat } from "./EditorDemoChat"

export function EditorChat({ mockupId }: { mockupId: string }) {
  const { state, dispatch } = useEditorChat()
  return state.demo ? (
    <EditorDemoChat mockupId={mockupId} />
  ) : (
    <AiEditorChat
      mockupId={mockupId}
      onDemo={() => dispatch({ type: "mode", demo: true })}
    />
  )
}
