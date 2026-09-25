import { Link } from "@tanstack/react-router"
import { RiArrowDownSLine, RiArrowRightUpLine } from "@remixicon/react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { StatusIcon } from "@/components/shared/StatusIcon"
import type { CatalogEntry } from "@/features/design-system/types"
import { APP_ROUTES } from "@/constants"

export function CatalogListGroup({
  label,
  entries,
}: {
  label: string
  entries: CatalogEntry[]
}) {
  return (
    <Collapsible defaultOpen className="group/catalog-section">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className="h-9 w-full justify-start bg-muted px-3"
          />
        }
      >
        <RiArrowDownSLine className="size-3 text-icon transition-transform group-data-closed/catalog-section:-rotate-90" />
        <span>{label}</span>
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {entries.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="py-1">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={APP_ROUTES.designSystemComponent}
              params={{ slug: entry.id }}
              className="catalog-entry [transition:background-color_var(--motion-fast),_color_var(--motion-fast)] [&:hover]:bg-accent [&:hover]:text-foreground [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-accent [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(hover:none)]:[&:hover]:bg-transparent [@media(hover:none)]:[&:hover]:text-inherit motion-reduce:animate-none motion-reduce:[transition:none] group/entry flex min-h-10 min-w-0 items-center gap-3 rounded-sm px-3 py-2"
            >
              <StatusIcon status="done" tone="neutral" className="size-3.5" />
              <span className="min-w-28 text-[13px] font-medium sm:min-w-40">
                {entry.name}
              </span>
              <RiArrowRightUpLine className="ml-auto size-3.5 text-icon opacity-0 group-hover/entry:opacity-100 group-focus-visible/entry:opacity-100" />
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
