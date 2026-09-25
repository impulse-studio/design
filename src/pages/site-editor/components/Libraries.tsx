import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"
import { Button } from "@/components/ui/button"
import { LibraryUpdate } from "./LibraryUpdate"
import { libraryPrefix } from "@/features/libraries/merge"
import type { SiteRecord } from "@/features/sites/types"
import type { LibrarySnapshot } from "@/features/libraries/types"

export function SiteLibraries({
  record,
  canEdit,
  onUpdated,
  onSelectFile,
}: {
  record: SiteRecord
  canEdit: boolean
  onUpdated: () => Promise<void>
  onSelectFile: (path: string) => void
}) {
  const orpc = useOrpc(),
    query = useQuery({
      ...orpc.libraries.list.queryOptions({ input: { projectId: record.id } }),
      refetchInterval: 15000,
    })
  const [target, setTarget] = useState<LibrarySnapshot | null>(null)
  const libraries =
    query.data?.items.filter((item) => item.framework === record.doc.kind) ?? []
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-3">
      <p className="text-xs text-muted-foreground">
        Chaque composant ajouté devient une copie propre à ce projet.
      </p>
      {query.error && (
        <p role="alert" className="text-xs text-destructive">
          {query.error.message}
        </p>
      )}
      {query.isPending && (
        <p role="status" className="text-xs text-muted-foreground">
          Chargement…
        </p>
      )}
      {libraries.map((library) => {
        const binding = record.doc.libraries?.find(
          (item) => item.snapshot.libraryId === library.id
        )
        const local = binding?.snapshot
        return (
          <section
            key={library.id}
            className="flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">{library.name}</h3>
              <span className="text-xs text-muted-foreground">
                {local ? `v${local.version}` : ""}
              </span>
            </div>
            {canEdit &&
              library.latest &&
              (!local || local.id !== library.latest.id) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTarget(library.latest)}
                >
                  {local
                    ? `Comparer avec v${library.version}`
                    : "Ajouter au projet"}
                </Button>
              )}
            {local?.payload.components.map((component) => (
              <Button
                key={`${component.path}:${component.exportName}`}
                size="sm"
                variant="ghost"
                className="justify-start truncate"
                onClick={() =>
                  onSelectFile(libraryPrefix(library.id) + component.path)
                }
              >
                {component.name}
              </Button>
            ))}
          </section>
        )
      })}
      {!query.isPending && !libraries.length && (
        <p className="text-xs text-muted-foreground">
          Aucune bibliothèque {record.doc.kind === "vue-vite" ? "Vue" : "React"}{" "}
          disponible pour cette équipe.
        </p>
      )}
      <Button variant="ghost" size="sm" render={<Link to="/libraries" />}>
        Gérer les bibliothèques
      </Button>
      {target && (
        <LibraryUpdate
          key={`${target.id}:${record.revision}`}
          record={record}
          snapshot={target}
          onClose={() => setTarget(null)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  )
}
