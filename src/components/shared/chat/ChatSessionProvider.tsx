import type { ReactNode } from "react"
import { ChatSessionContext } from "@/features/chat/context"
import { useChatSession } from "@/features/chat/use-chat-session"

export function ChatSessionProvider({
  mockupId,
  children,
}: {
  mockupId: string
  children: ReactNode
}) {
  const session = useChatSession(mockupId)
  return (
    <ChatSessionContext.Provider value={session}>
      {children}
    </ChatSessionContext.Provider>
  )
}
