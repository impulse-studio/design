import { Markdown } from "@tanstack/markdown/react"
import { streamingMarkdownExtension } from "@tanstack/markdown/extensions/streaming"
import { ChatMarkdownLink } from "./ChatMarkdownLink"
import { ChatMarkdownImage } from "./ChatMarkdownImage"

const components = { a: ChatMarkdownLink, img: ChatMarkdownImage }
const streamingExtensions = [streamingMarkdownExtension()]

export function ChatMarkdown({
  text,
  streaming = false,
}: {
  text: string
  streaming?: boolean
}) {
  return (
    <div className="chat-markdown wrap-anywhere text-[12px] leading-[1.75] [&_:is(h1,_h2,_h3,_h4)]:font-semibold [&_:is(h1,_h2,_h3,_h4)]:text-[14px] [&_:is(h1,_h2,_h3,_h4)]:mt-3 [&_:is(h1,_h2,_h3,_h4)]:mb-1.5 [&_>_:first-child]:mt-[0] [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:[border-collapse:collapse] [&_:is(th,_td)]:border [&_:is(th,_td)]:border-border [&_:is(th,_td)]:py-1 [&_:is(th,_td)]:px-2 [&_pre]:max-w-full [&_pre]:text-[11px] [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground">
      <Markdown
        allowHtml={false}
        headingIds={false}
        components={components}
        extensions={streaming ? streamingExtensions : undefined}
      >
        {text}
      </Markdown>
    </div>
  )
}
