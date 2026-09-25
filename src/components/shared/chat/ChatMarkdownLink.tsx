import type { ComponentProps } from "react"

export function ChatMarkdownLink({
  href,
  children,
  ...props
}: ComponentProps<"a">) {
  const safe =
    href && /^(https?:\/\/|mailto:|\/[^/]|#)/i.test(href) ? href : undefined
  return (
    <a
      {...props}
      href={safe}
      target={safe?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
