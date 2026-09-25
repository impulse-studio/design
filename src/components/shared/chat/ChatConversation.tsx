import type { ReactNode } from "react"
import type { ChatCallbacks } from "@/features/chat/types"
import type { ChatMessage } from "@/validators/chat/messages"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { ChatMessageItem } from "./ChatMessageItem"

export type { ChatMessage } from "@/validators/chat/messages"
export interface ChatConversationProps extends ChatCallbacks {
  messages: ChatMessage[]
  streaming: boolean
  activeMessageId?: string
  canRetry?: boolean
  emptyState?: ReactNode
  renderAfterMessage?: (message: ChatMessage) => ReactNode
}

export function ChatConversation({
  messages,
  streaming,
  activeMessageId,
  canRetry = true,
  emptyState,
  renderAfterMessage,
  ...callbacks
}: ChatConversationProps) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-6 p-3">
            {!messages.length && (
              <MessageScrollerItem messageId="welcome">
                {emptyState}
              </MessageScrollerItem>
            )}
            {messages.map((message, index) => (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={message.role === "user"}
              >
                <ChatMessageItem
                  message={message}
                  streaming={
                    message.status === "streaming" ||
                    (streaming &&
                      !message.status &&
                      index === messages.length - 1)
                  }
                  active={message.id === activeMessageId}
                  canRetry={canRetry && !activeMessageId}
                  callbacks={callbacks}
                />
                {renderAfterMessage?.(message)}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton aria-label="Dernier message" />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
