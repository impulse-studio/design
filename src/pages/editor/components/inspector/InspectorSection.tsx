import type { ReactNode } from "react"
import { RiArrowDownSLine } from "@remixicon/react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function InspectorSection({
  title,
  children,
  actions,
  defaultOpen = true,
  indicator,
}: {
  title: string
  children?: ReactNode
  actions?: ReactNode
  defaultOpen?: boolean
  indicator?: ReactNode
}) {
  return (
    <>
      <Separator />
      <Collapsible
        defaultOpen={defaultOpen}
        className="editor-inspector-section pt-3 pb-4 px-4 [&_[data-slot=field-label]]:text-[11px] [&_[data-slot=field-label]]:font-normal [&_[data-slot=field-label]]:text-muted-foreground [&_[data-slot=field-label]]:leading-[16px] [&:has([data-slot=collapsible-content][hidden])]:pb-3 [&[data-empty]]:pb-3 [&[data-empty]_.editor-section-content]:hidden"
        data-empty={!children || undefined}
      >
        <div className="editor-section-heading flex items-center min-h-[20px] gap-1 [&_>_button]:h-[20px] [&_>_button]:w-[20px]">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="editor-section-trigger bg-transparent flex-1 min-w-0 h-[20px] [padding:0] justify-between rounded-[3px] text-[11px] font-semibold text-left [transition:background-color_var(--motion-fast)_var(--motion-ease-out),_color_var(--motion-fast)_var(--motion-ease-out)] [&[data-panel-open]_.editor-section-chevron]:opacity-[0] [&:focus-visible_.editor-section-chevron]:opacity-[1] [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-transparent [@media(hover:hover)_and_(pointer:fine)]:[&:hover_.editor-section-chevron]:opacity-[1] [@media(hover:none),_(pointer:coarse)]:[&[data-panel-open]_.editor-section-chevron]:opacity-[1] motion-reduce:[transition:none]"
              />
            }
          >
            <span>{title}</span>
            <span className="editor-section-chevron grid place-items-center w-[16px] h-[16px] text-muted-foreground [&_svg]:w-[14px] [&_svg]:h-[14px]">
              {indicator ?? <RiArrowDownSLine />}
            </span>
          </CollapsibleTrigger>
          {actions}
        </div>
        <CollapsibleContent>
          <FieldGroup className="editor-section-content gap-3 pt-4">{children}</FieldGroup>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
