import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  RiSearchLine,
  RiLayoutGridLine,
  RiArrowRightUpLine,
} from "@remixicon/react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { BrandMark } from "@/components/shared/BrandMark"
import { CatalogNavGroup } from "./CatalogNavGroup"
import { catalog, categories } from "@/features/design-system/catalog"
import { APP_ROUTES, DESIGN_SYSTEM_NAME, EXTERNAL_LINKS } from "@/constants"

export function CatalogSidebar({
  currentId,
  onSearch,
}: {
  currentId: string
  onSearch: () => void
}) {
  const { setOpenMobile } = useSidebar()
  const [isScrolled, setIsScrolled] = useState(false)
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="gap-4 px-3 py-3">
        <Link
          to={APP_ROUTES.designSystem}
          aria-label={`${DESIGN_SYSTEM_NAME}, vue d’ensemble`}
          onClick={() => setOpenMobile(false)}
        >
          <BrandMark />
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            setOpenMobile(false)
            onSearch()
          }}
          className="w-full justify-between text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <RiSearchLine data-icon="inline-start" />
            <span>Rechercher…</span>
          </span>
          <Kbd>⌘ K</Kbd>
        </Button>
      </SidebarHeader>
      <SidebarContent
        className="gap-3 px-1 pb-5"
        onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}
        style={{
          maskImage: isScrolled
            ? "linear-gradient(to bottom, transparent, black 24px)"
            : undefined,
        }}
      >
        <SidebarGroup className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to={APP_ROUTES.designSystem} />}
                isActive={!currentId}
                onClick={() => setOpenMobile(false)}
              >
                <RiLayoutGridLine />
                <span>Vue d’ensemble</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="py-0">
          <SidebarGroupLabel>Fondations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {catalog
                .filter((e) => e.kind === "foundation")
                .map((entry) => (
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
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="py-0">
          <SidebarGroupLabel>
            Composants{" "}
            <span className="ml-auto tabular-nums">
              {catalog.filter((entry) => entry.kind === "component").length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            {categories
              .filter((c) => c !== "Fondations" && c !== "Compositions")
              .map((category) => (
                <CatalogNavGroup
                  key={category}
                  label={category}
                  currentId={currentId}
                  entries={catalog.filter((e) => e.category === category)}
                />
              ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="py-0">
          <SidebarGroupLabel>Assemblages</SidebarGroupLabel>
          <CatalogNavGroup
            label="Compositions"
            currentId={currentId}
            entries={catalog.filter((e) => e.kind === "composition")}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-4 border-t px-4 py-4">
        <a
          href={`${EXTERNAL_LINKS.shadcnBaseComponents}/button`}
          target="_blank"
          rel="noreferrer"
          className="catalog-entry [transition:background-color_var(--motion-fast),_color_var(--motion-fast)] [&:hover]:bg-accent [&:hover]:text-foreground [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:bg-accent [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:text-foreground [@media(hover:none)]:[&:hover]:bg-transparent [@media(hover:none)]:[&:hover]:text-inherit motion-reduce:animate-none motion-reduce:[transition:none] flex items-center justify-between rounded-md px-1 py-1 text-xs"
        >
          Documentation shadcn
          <RiArrowRightUpLine className="size-3.5" />
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}
