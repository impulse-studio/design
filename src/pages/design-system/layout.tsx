import { useState } from "react"
import type { CSSProperties } from "react"
import { Link, Outlet, useLocation } from "@tanstack/react-router"
import { RiArrowRightSLine } from "@remixicon/react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CatalogSidebar } from "@/components/design-system/CatalogSidebar"
import { CatalogSearch } from "@/components/design-system/CatalogSearch"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { catalog } from "@/features/design-system/catalog"
import { APP_ROUTES } from "@/constants"

export function DesignSystemLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const currentId = location.pathname.split("/")[2] ?? ""
  const current = catalog.find((entry) => entry.id === currentId)
  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" } as CSSProperties}>
      <a
        href="#main-content"
        className="skip-link fixed top-[-100px] left-[12px] z-[100] rounded-md bg-primary px-4 py-2 text-primary-foreground [&:focus]:top-[12px]"
      >
        Aller au contenu
      </a>
      <CatalogSidebar
        currentId={currentId}
        onSearch={() => setSearchOpen(true)}
      />
      <SidebarInset className="min-w-0 overflow-clip md:rounded-xl">
        <header className="sticky top-0 z-20 flex h-11 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger
              className="md:hidden"
              aria-label="Ouvrir la navigation"
            />
            <nav
              aria-label="Fil d’Ariane"
              className="flex min-w-0 items-center gap-2 text-xs"
            >
              <Link
                to={APP_ROUTES.designSystem}
                className="text-muted-foreground hover:text-foreground"
              >
                Bibliothèque
              </Link>
              <RiArrowRightSLine className="size-3 text-muted-foreground" />
              <span className="truncate">
                {current?.name ?? "Vue d’ensemble"}
              </span>
            </nav>
          </div>
          <ThemeToggle />
        </header>
        <div
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] px-4 py-6 outline-none md:px-6"
        >
          <Outlet />
        </div>
      </SidebarInset>
      <CatalogSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  )
}
