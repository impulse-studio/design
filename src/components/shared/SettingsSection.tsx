import type { ReactNode } from "react"
import { useId } from "react"
import { FieldGroup } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

export function SettingsSection({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">
          {title}
        </h2>
        {description && <p className="body-copy text-[13px] leading-[1.55]">{description}</p>}
      </div>
      <FieldGroup>{children}</FieldGroup>
      {footer && (
        <>
          <Separator />
          <div className="flex items-center justify-end gap-2">{footer}</div>
        </>
      )}
    </section>
  )
}
