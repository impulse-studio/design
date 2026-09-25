import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { RiArrowRightSLine } from "@remixicon/react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import type { CatalogEntry } from "@/features/design-system/types"
import { APP_ROUTES } from "@/constants"

export function CatalogNavGroup({
  label,
  entries,
  currentId,
}: {
  label: string
  entries: CatalogEntry[]
  currentId: string
}) {
  const [expanded, setExpanded] = useState(label === "Actions")
  const { setOpenMobile } = useSidebar()
  const active = entries.some((entry) => entry.id === currentId)
  useEffect(() => {
    if (active) setExpanded(true)
  }, [active, currentId])
  return (
    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="group/nav"
    >
      <CollapsibleTrigger render={<SidebarMenuButton />}>
        <RiArrowRightSLine className="transition-transform duration-150 group-data-open/nav:rotate-90" />
        <span>{label}</span>
        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
          {entries.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="mt-1 ml-3 w-auto border-l border-border pl-3">
          {entries.map((entry) => (
            <SidebarMenuItem key={entry.id}>
              <SidebarMenuButton
                render={
                  <Link
                    to={APP_ROUTES.designSystemComponent}
                    params={{ slug: entry.id }}
                  />
                }
                isActive={currentId === entry.id}
                onClick={() => setOpenMobile(false)}
              >
                {entry.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  )
}
