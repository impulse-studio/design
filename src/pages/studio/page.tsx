import { CreateSiteDialog } from "./components/CreateSiteDialog"
import { useState } from "react"
import type { CSSProperties } from "react"
import { useLoaderData, useNavigate, useRouter } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  RiAddLine,
  RiArtboardLine,
  RiSearchLine,
  RiSortDesc,
  RiArrowDownSLine,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { StudioSidebar } from "./components/StudioSidebar"
import { StudioDocuments } from "./components/StudioDocuments"
import { APP_ROUTES } from "@/constants"
import { useOrpc } from "@/server/use-orpc"

export function StudioPage() {
  const { records, error, team, teams, canEdit } = useLoaderData({
    from: APP_ROUTES.studio,
  })
  const navigate = useNavigate(),
    router = useRouter(),
    queryClient = useQueryClient(),
    orpc = useOrpc(),
    create = useMutation(orpc.mockups.create.mutationOptions()),
    createSite = useMutation(orpc.sites.create.mutationOptions())
  const [pending, setPending] = useState(false),
    [failure, setFailure] = useState<string | null>(null)
  const [query, setQuery] = useState(""),
    [recent, setRecent] = useState(false),
    [sort, setSort] = useState("updated")
  const add = async (site = false) => {
    setPending(true)
    setFailure(null)
    try {
      const record = site
        ? await createSite.mutateAsync({ name: "Nouveau site" })
        : await create.mutateAsync({ name: "Sans titre" })
      await queryClient.invalidateQueries({
        queryKey: orpc.mockups.list.queryKey(),
      })
      await navigate({
        to: APP_ROUTES.editor,
        params: { mockupId: record.id },
      })
    } catch (reason) {
      setFailure(
        site && reason instanceof Error
          ? reason.message
          : "La maquette n’a pas pu être créée. Vérifiez la connexion à PostgreSQL."
      )
      setPending(false)
    }
  }
  const filtered = records
    .filter(
      (record) =>
        record.name.toLowerCase().includes(query.toLowerCase()) &&
        (!recent ||
          Date.now() - new Date(record.updatedAt).getTime() < 7 * 86400000)
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "fr")
        : b.updatedAt.localeCompare(a.updatedAt)
    )
  return (
    <SidebarProvider
      className="studio-home min-h-[100dvh] text-[13px] [&_>_[data-slot=sidebar-inset]]:min-w-0 min-[768px]:[&_>_[data-slot=sidebar-inset]]:[margin:8px_8px_8px_0]"
      style={{ "--sidebar-width": "240px" } as CSSProperties}
    >
      <StudioSidebar
        team={team}
        teams={teams}
        canEdit={canEdit}
        records={records}
        recent={recent}
        onRecentChange={setRecent}
        onCreate={() => void add()}
        pending={pending}
      />
      <SidebarInset>
        <header className="studio-topbar flex h-[44px] shrink-0 items-center justify-between gap-3 border-b border-border [padding:0_20px] text-[13px] max-[800px]:px-3 [&_>_[data-slot=button]]:font-normal [&_>_[data-slot=button]]:text-muted-foreground [&_[data-slot=sidebar-trigger]]:text-icon [@media(hover:hover)_and_(pointer:fine)]:[&_>_[data-slot=button]:hover]:text-foreground [@media(pointer:coarse)]:[&_[data-slot=button]]:min-h-[44px]">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="text-muted-foreground">{team.name}</span>
            <span className="text-muted-foreground">/</span>
            <span>Maquettes</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void add()}
              disabled={pending || !canEdit}
            >
              {pending ? <Spinner /> : <RiAddLine data-icon="inline-start" />}
              Nouvelle maquette
            </Button>
            <CreateSiteDialog
              disabled={pending || !canEdit}
              onCreate={async (input) => {
                const record = await createSite.mutateAsync(input)
                await queryClient.invalidateQueries({
                  queryKey: orpc.mockups.list.queryKey(),
                })
                await navigate({
                  to: APP_ROUTES.editor,
                  params: { mockupId: record.id },
                })
              }}
            />
          </div>
        </header>
        <div className="studio-main min-w-0 [padding:28px_0_64px]">
          <div className="studio-title-row [padding:0_24px_24px] max-[800px]:px-5 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-semibold [&_h1]:tracking-[-0.025em] [&_p]:mt-1 [&_p]:text-[13px] [&_p]:leading-[20px] [&_p]:text-muted-foreground">
            <div>
              <h1>{recent ? "Récemment modifiées" : "Maquettes"}</h1>
              <p>Vos projets, vos composants, votre espace de travail.</p>
            </div>
          </div>
          <div className="studio-list-toolbar flex min-h-[48px] items-center justify-between gap-3 px-6 py-2 text-[13px] max-[800px]:flex-wrap max-[800px]:px-5 [&_>_div:first-child]:min-h-[28px] [&_>_div:first-child]:gap-2 [&_>_div:first-child]:rounded-full [&_>_div:first-child]:bg-secondary [&_>_div:first-child]:px-2.5 [&_>_div:first-child]:py-1 [&_>_div:first-child]:font-medium [&_>_div:first-child_>_svg]:h-[14px] [&_>_div:first-child_>_svg]:w-[14px] [&_>_div:first-child_>_svg]:text-icon [&_>_div:last-child_>_[data-slot=dropdown-menu-trigger]]:rounded-full">
            <div className="flex items-center gap-2">
              <RiArtboardLine className="size-4 text-muted-foreground" />
              <span>
                {recent ? "Derniers 7 jours" : "Toutes les maquettes"}
              </span>
              <span className="studio-count ml-0.5 text-[12px] font-normal text-muted-foreground tabular-nums">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <InputGroup className="studio-search h-[28px] w-[176px] border-border bg-subtle shadow-none [&_input]:h-full [&_input]:text-[13px] [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:[&_input]:text-[16px]">
                <InputGroupAddon>
                  <RiSearchLine />
                </InputGroupAddon>
                <InputGroupInput
                  value={query}
                  aria-label="Rechercher une maquette"
                  placeholder="Rechercher…"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </InputGroup>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  <RiSortDesc data-icon="inline-start" />
                  Trier
                  <RiArrowDownSLine data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                    <DropdownMenuRadioItem value="updated">
                      Dernière modification
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">
                      Nom
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {error || failure ? (
            <Empty className="studio-empty min-h-[360px] border-0 [&_[data-slot=empty-description]]:max-w-[300px] [&_[data-slot=empty-description]]:text-[13px] [&_[data-slot=empty-title]]:text-[16px] [&_[data-slot=empty-title]]:font-medium">
              <EmptyHeader>
                <EmptyTitle>Connexion indisponible</EmptyTitle>
                <EmptyDescription>{error ?? failure}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFailure(null)
                    void router.invalidate()
                  }}
                >
                  Réessayer
                </Button>
              </EmptyContent>
            </Empty>
          ) : filtered.length ? (
            <StudioDocuments records={filtered} canEdit={canEdit} />
          ) : (
            <Empty className="studio-empty min-h-[360px] border-0 [&_[data-slot=empty-description]]:max-w-[300px] [&_[data-slot=empty-description]]:text-[13px] [&_[data-slot=empty-title]]:text-[16px] [&_[data-slot=empty-title]]:font-medium">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <RiArtboardLine />
                </EmptyMedia>
                <EmptyTitle>
                  {query || recent
                    ? "Aucune maquette trouvée"
                    : "Votre première maquette"}
                </EmptyTitle>
                <EmptyDescription>
                  {query
                    ? "Essayez un autre nom."
                    : recent
                      ? "Les maquettes modifiées dans les 7 derniers jours apparaîtront ici."
                      : "Commencez avec une frame vide, puis composez avec les composants Digi."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {query || recent ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("")
                      setRecent(false)
                    }}
                  >
                    Voir toutes les maquettes
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => void add()}
                    disabled={pending || !canEdit}
                  >
                    <RiAddLine data-icon="inline-start" />
                    Créer une maquette
                  </Button>
                )}
              </EmptyContent>
            </Empty>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
