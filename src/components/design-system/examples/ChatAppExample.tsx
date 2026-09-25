import source from "./ChatAppExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useEffect, useRef, useState } from "react"
import { ChatApp } from "@/components/shared/chat/ChatApp"
import { ChatNavigation } from "@/components/shared/chat/ChatNavigation"
import { ChatConversation } from "@/components/shared/chat/ChatConversation"
import type { ChatMessage } from "@/components/shared/chat/ChatConversation"
import { PromptInput } from "@/components/shared/PromptInput"

const greeting: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Bonjour ! Décrivez la page que vous souhaitez créer.",
}
const demoReply =
  "Voici une proposition : un titre clair, un formulaire d’inscription et une confirmation. Je peux ensuite détailler les composants et les interactions. Cette réponse est une démonstration locale."

export function ChatAppExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting])
  const [prompt, setPrompt] = useState("")
  const [streaming, setStreaming] = useState(false)
  const sequence = useRef(0)
  useEffect(() => {
    if (!streaming) return
    let length = 0
    const timer = window.setInterval(() => {
      length = Math.min(length + 5, demoReply.length)
      const text = demoReply.slice(0, length)
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1 ? { ...message, text } : message
        )
      )
      if (length === demoReply.length) setStreaming(false)
    }, 35)
    return () => window.clearInterval(timer)
  }, [streaming])
  return (
    <ChatApp
      sidebarWidth="14rem"
      className="relative h-[560px]"
      defaultOpen={false}
    >
      <ChatNavigation
        onNewChat={() => {
          setStreaming(false)
          setMessages([greeting])
          setPrompt("")
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b pr-4 pl-14 text-sm font-medium">
          Assistant{" "}
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            Démo
          </span>
        </header>
        <ChatConversation messages={messages} streaming={streaming} />
        <div className="p-3">
          <PromptInput
            value={prompt}
            onValueChange={setPrompt}
            loading={streaming}
            onStop={() => setStreaming(false)}
            onSubmit={(value) => {
              if (streaming) return
              sequence.current += 1
              setMessages((current) => [
                ...current,
                { id: `user-${sequence.current}`, role: "user", text: value },
                {
                  id: `assistant-${sequence.current}`,
                  role: "assistant",
                  text: "",
                },
              ])
              setPrompt("")
              setStreaming(true)
            }}
          />
        </div>
      </div>
    </ChatApp>
  )
}
// @example:end

export const getCode = createExampleCode(source)
