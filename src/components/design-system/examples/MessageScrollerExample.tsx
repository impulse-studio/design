import source from "./MessageScrollerExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"

export function MessageScrollerExample() {
  const [count, setCount] = useState(4)
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <MessageScrollerProvider>
        <MessageScroller className="h-56 rounded-lg border">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 p-4">
              {Array.from({ length: count }, (_, index) => (
                <MessageScrollerItem key={index}>
                  <Message align={index % 2 === 0 ? "start" : "end"}>
                    <MessageContent>
                      <Bubble variant={index % 2 === 0 ? "outline" : "default"}>
                        <BubbleContent>
                          Message {index + 1} ·{" "}
                          {index % 2 === 0
                            ? "Une nouvelle proposition."
                            : "Les détails sont validés."}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton aria-label="Dernier message" />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="outline" onClick={() => setCount(count + 1)}>
        Ajouter un message
      </Button>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
