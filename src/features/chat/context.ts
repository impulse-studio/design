import { createContext, useContext } from "react"
import type { ChatSession } from "./use-chat-session"

export const ChatSessionContext = createContext<ChatSession | null>(null)
export const useEditorChat = () => {
  const session = useContext(ChatSessionContext)
  if (!session) throw new Error("ChatSessionProvider manquant")
  return session
}
