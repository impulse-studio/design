import type { ComponentProps } from "react"

export function ChatMarkdownImage({ alt }: ComponentProps<"img">) {
  return (
    <span className="text-muted-foreground">
      [Image : {alt || "sans description"}]
    </span>
  )
}
