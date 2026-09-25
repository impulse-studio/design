import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { RiListCheck, RiLayoutGridLine } from "@remixicon/react"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { SearchField } from "@/components/shared/SearchField"
import { StatusIcon } from "@/components/shared/StatusIcon"
import { CatalogCard } from "@/components/design-system/CatalogCard"
import { CatalogListGroup } from "@/components/design-system/CatalogListGroup"
import { catalog, categories } from "@/features/design-system/catalog"
import { searchCatalog } from "@/features/design-system/search"
import { APP_ROUTES } from "@/constants"

export function DesignSystemPage() {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState("component")
  const [display, setDisplay] = useState("list")
  const entries = searchCatalog(
    catalog.filter((entry) => entry.kind === kind),
    query
  )
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_20] text-[22px] leading-[30px] font-semibold tracking-[-0.022em]">Bibliothèque de composants</h1>
        <Link
          to={APP_ROUTES.designSystemComponent}
          params={{ slug: "status-picker" }}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <StatusIcon status="in-progress" />
          Statuts
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <Tabs value={kind} onValueChange={(value) => setKind(String(value))}>
          <TabsList>
            <TabsTrigger value="component">
              Composants{" "}
              <span className="ml-1 text-xs text-muted-foreground">
                {catalog.filter((entry) => entry.kind === "component").length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="composition">Compositions</TabsTrigger>
            <TabsTrigger value="foundation">Fondations</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchField
            value={query}
            onValueChange={setQuery}
            placeholder="Filtrer…"
            label="Filtrer la bibliothèque"
            className="w-full sm:w-44"
          />
          <ToggleGroup
            value={[display]}
            onValueChange={(value) => {
              if (value[0]) setDisplay(value[0])
            }}
            size="sm"
            aria-label="Affichage du catalogue"
          >
            <ToggleGroupItem value="list" aria-label="Vue liste">
              <RiListCheck />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Vue grille">
              <RiLayoutGridLine />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {entries.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Aucun composant trouvé</EmptyTitle>
            <EmptyDescription>
              Essayez un nom ou une intention comme « bouton ».
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : display === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <CatalogCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {categories
            .filter((category) =>
              entries.some((entry) => entry.category === category)
            )
            .map((category) => (
              <CatalogListGroup
                key={category}
                label={category}
                entries={entries.filter((entry) => entry.category === category)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
