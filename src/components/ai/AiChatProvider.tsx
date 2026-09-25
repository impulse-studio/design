import type { ReactNode } from "react"
import { AiChatContext } from "@/features/ai/context"
import { useAiChat } from "@/features/ai/use-ai-chat"

export function AiChatProvider({
  mockupId,
  children,
}: {
  mockupId: string
  children: ReactNode
}) {
  const session = useAiChat(mockupId)
  return (
    <AiChatContext.Provider value={session}>{children}</AiChatContext.Provider>
  )
}
