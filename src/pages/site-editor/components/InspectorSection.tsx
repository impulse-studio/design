import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function SiteInspectorSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="border-b border-border">
      <CollapsibleTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-full justify-between rounded-md px-2 font-medium"
          />
        }
      >
        <span>{title}</span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-3">
        <div className="flex flex-col gap-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
