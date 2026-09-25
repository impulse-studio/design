import type { ReactNode } from "react"

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex max-w-2xl flex-col gap-1.5">
        {eyebrow && <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em]">{eyebrow}</p>}
        <h1 className="page-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_20] text-[22px] leading-[30px] font-semibold tracking-[-0.022em]">{title}</h1>
        {description && <p className="body-copy text-[13px] leading-[1.55] max-w-xl">{description}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  )
}
