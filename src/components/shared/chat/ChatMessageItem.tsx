import type { ChatCallbacks, ChatMessage } from "@/features/chat/types"
import { CHAT_EFFORTS, modelLabel } from "@/features/chat/catalog"
import { Message, MessageContent, MessageHeader } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { StreamingResponse } from "@/components/shared/streaming/StreamingResponse"
import { ChatMessageBlock } from "./ChatMessageBlock"
import { ChatMarkdown } from "./ChatMarkdown"

const artifacts = new Set(["diff", "image", "sources"])

export function ChatMessageItem({
  message,
  streaming,
  active,
  canRetry,
  callbacks,
}: {
  message: ChatMessage
  streaming: boolean
  active: boolean
  canRetry: boolean
  callbacks: ChatCallbacks
}) {
  const user = message.role === "user"
  const terminal =
    !message.status || ["complete", "stopped", "error"].includes(message.status)
  return (
    <Message align={user ? "end" : "start"} className="chat-turn text-[12px] [&_[data-slot=card]]:min-w-0 [&_[data-slot=card-content]]:px-2.5 [&_[data-slot=badge]]:whitespace-normal [&_[data-slot=message-content]]:min-w-0 [&_[data-slot=bubble]]:max-w-full [&_[data-slot=marker]]:text-[11px]">
      <MessageContent>
        <MessageHeader className="flex-col items-start gap-1 px-0">
          <span>{user ? "Vous" : "Assistant"}</span>
          {message.request && (
            <span className="chat-turn-meta text-[10px] font-normal text-muted-foreground">
              {modelLabel(message.request.model)} ·{" "}
              {
                CHAT_EFFORTS.find(
                  (item) => item.value === message.request?.effort
                )?.label
              }
            </span>
          )}
        </MessageHeader>
        {user && (
          <>
            <Bubble variant="secondary" align="end">
              <BubbleContent className="whitespace-pre-wrap">
                {message.text}
              </BubbleContent>
            </Bubble>
            {!!message.request?.context.length && (
              <div className="flex max-w-full flex-wrap gap-1">
                {message.request.context.map((item) => (
                  <Badge key={item.id} variant="outline" className="max-w-full">
                    <span className="truncate">{item.label}</span>
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
        {message.blocks
          ?.filter((block) => !artifacts.has(block.type))
          .map((block) => (
            <ChatMessageBlock
              key={block.type}
              block={block}
              messageId={message.id}
              interactive={active}
              callbacks={callbacks}
            />
          ))}
        {!user && (message.text || terminal) && (
          <>
            {message.status === "error" && (
              <Alert variant="destructive">
                <AlertTitle>Interruption simulée</AlertTitle>
              </Alert>
            )}
            <StreamingResponse
              status={
                streaming
                  ? "streaming"
                  : message.status === "error" || message.status === "stopped"
                    ? "error"
                    : "complete"
              }
              copyText={message.text}
              showActions={terminal}
              onRetry={
                canRetry && terminal && callbacks.onRetry
                  ? () => callbacks.onRetry?.(message.id)
                  : undefined
              }
              feedback={message.feedback ?? null}
              onFeedbackChange={(feedback) =>
                callbacks.onFeedback?.(message.id, feedback)
              }
            >
              {message.text && (
                <ChatMarkdown text={message.text} streaming={streaming} />
              )}
            </StreamingResponse>
          </>
        )}
        {message.blocks
          ?.filter((block) => artifacts.has(block.type))
          .map((block) => (
            <ChatMessageBlock
              key={block.type}
              block={block}
              messageId={message.id}
              interactive={active}
              callbacks={callbacks}
            />
          ))}
        {message.status === "stopped" && (
          <Marker>
            <MarkerContent>
              Génération interrompue · résultat partiel conservé
            </MarkerContent>
          </Marker>
        )}
      </MessageContent>
    </Message>
  )
}
