import source from "./MessageExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "@/components/ui/message"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function MessageExample() {
  return (
    <Message className="w-full max-w-md">
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Alex · Design</MessageHeader>
        <Bubble>
          <BubbleContent>
            Les nouvelles variantes sont prêtes pour la revue.
          </BubbleContent>
        </Bubble>
        <MessageFooter>Il y a quelques instants</MessageFooter>
      </MessageContent>
    </Message>
  )
}
// @example:end

export const getCode = createExampleCode(source)
