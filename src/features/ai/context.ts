import { createContext, useContext } from "react"
import type { useAiChat } from "./use-ai-chat"

export const AiChatContext = createContext<ReturnType<typeof useAiChat> | null>(
  null
)
export const useAiSession = () => {
  const session = useContext(AiChatContext)
  if (!session) throw new Error("AiChatProvider manquant")
  return session
}
