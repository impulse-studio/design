import { RiGlobalLine, RiExternalLinkLine } from "@remixicon/react"
import type { CitationItem } from "./types"

export function CitationRow({
  citation,
  index,
  idPrefix,
}: {
  citation: CitationItem
  index: number
  idPrefix: string
}) {
  const content = (
    <>
      <RiGlobalLine
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="truncate text-sm font-medium text-foreground/80 transition-colors group-hover/citation:text-foreground">
          {citation.title}
        </span>
        {citation.domain ? (
          <span className="min-w-0 truncate text-xs text-muted-foreground/60">
            {citation.domain}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="grid size-5 place-items-center rounded-md bg-foreground/[0.05] text-[10px] font-semibold text-muted-foreground tabular-nums">
          {index}
        </span>
        {citation.url ? (
          <RiExternalLinkLine className="size-3.5 text-muted-foreground/40 transition-colors group-hover/citation:text-muted-foreground" />
        ) : null}
      </span>
    </>
  )
  const className =
    "group/citation flex items-center gap-2 rounded-md px-1.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const id = `${idPrefix}-${citation.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`

  return citation.url ? (
    <a
      id={id}
      href={citation.url}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
    >
      {content}
    </a>
  ) : (
    <div id={id} className={className}>
      {content}
    </div>
  )
}
