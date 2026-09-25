import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LibraryImportForm } from "./components/ImportForm"
import { LibraryCatalog } from "./components/Catalog"
import { LibraryConnection } from "./components/Connection"
import type { LibrarySnapshot } from "@/features/libraries/types"

export function LibrariesPage() {
  const orpc = useOrpc(),
    query = useQuery({
      ...orpc.libraries.list.queryOptions({ input: {} }),
      refetchInterval: 10000,
    }),
    disconnect = useMutation(orpc.libraries.disconnect.mutationOptions())
  const [selected, setSelected] = useState<string | null>(null),
    [importing, setImporting] = useState<LibrarySnapshot | "new" | null>(null),
    [error, setError] = useState<string | null>(null)
  const library =
    query.data?.items.find((item) => item.id === selected) ??
    query.data?.items[0]
  const refresh = async () => {
    await query.refetch()
  }
  const revoke = async (id: string) => {
    if (disconnect.isPending) return
    try {
      await disconnect.mutateAsync({ id })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Action impossible.")
    }
  }
  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-6">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        render={<Link to="/" />}
      >
        Retour au studio
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Bibliothèques</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Les composants de votre équipe, personnalisables dans chaque projet.
          </p>
        </div>
        {query.data?.canManage && (
          <Button size="sm" onClick={() => setImporting("new")}>
            Importer une bibliothèque
          </Button>
        )}
      </div>
      {(error || query.error) && (
        <p role="alert" className="text-sm text-destructive">
          {error ?? query.error?.message}
        </p>
      )}
      {query.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Chargement des bibliothèques…
        </p>
      ) : !query.data?.items.length ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          Aucune bibliothèque.{" "}
          {query.data?.canManage
            ? "Importez vos composants pour les partager avec l’équipe."
            : "Un propriétaire ou un membre autorisé peut importer une bibliothèque."}
        </div>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
          <nav
            aria-label="Bibliothèques de l’équipe"
            className="flex flex-col gap-1"
          >
            {query.data.items.map((item) => (
              <Button
                key={item.id}
                variant={item.id === library?.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setSelected(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </nav>
          {library?.latest && (
            <section key={library.id} className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="section-title">{library.name}</h2>
                  <Badge variant="secondary">
                    {library.framework === "vue-vite" ? "Vue" : "React"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    v{library.version}
                  </span>
                </div>
                {query.data.canManage && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImporting(library.latest)}
                  >
                    Importer une version
                  </Button>
                )}
              </div>
              <LibraryCatalog snapshot={library.latest} />
              {query.data.canManage && (
                <LibraryConnection libraryId={library.id} onChanged={refresh} />
              )}
              {library.connections.length > 0 && (
                <div className="divide-y rounded-md border">
                  {library.connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between gap-4 p-3 text-xs"
                    >
                      <div>
                        <p>
                          {!connection.claimed
                            ? "En attente de connexion"
                            : connection.lastSeenAt &&
                                Date.now() -
                                  new Date(connection.lastSeenAt).getTime() <
                                  15000
                              ? "Connecteur actif"
                              : "Connecteur hors ligne"}
                        </p>
                        <p className="text-muted-foreground">
                          {connection.lastSuccessAt
                            ? `Dernière synchronisation : ${new Date(connection.lastSuccessAt).toLocaleString("fr-FR")}`
                            : "Aucune synchronisation"}
                        </p>
                        {connection.error && (
                          <p className="text-destructive">{connection.error}</p>
                        )}
                      </div>
                      {query.data.canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={disconnect.isPending}
                          onClick={() => void revoke(connection.id)}
                        >
                          Déconnecter
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
      <Dialog
        open={importing !== null}
        onOpenChange={(open) => {
          if (!open) setImporting(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {importing === "new"
                ? "Importer une bibliothèque"
                : "Publier une nouvelle version"}
            </DialogTitle>
            <DialogDescription>
              Les projets conservent leur copie et leurs personnalisations.
            </DialogDescription>
          </DialogHeader>
          {importing && (
            <LibraryImportForm
              key={typeof importing === "string" ? importing : importing.id}
              existing={typeof importing === "string" ? undefined : importing}
              onSaved={async () => {
                await refresh()
                setImporting(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
