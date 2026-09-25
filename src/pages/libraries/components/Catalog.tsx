import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { SearchField } from "@/components/shared/SearchField"
import { disposeSiteRuntime, startSiteRuntime } from "@/features/sites/runtime"
import { useMutation } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"
import { applyLibrary, libraryPrefix } from "@/features/libraries/merge"
import type { LibrarySnapshot } from "@/features/libraries/types"

export function LibraryCatalog({ snapshot }: { snapshot: LibrarySnapshot }) {
  const orpc = useOrpc()
  const scaffold = useMutation(orpc.sites.scaffold.mutationOptions())
  const [query, setQuery] = useState(""),
    [url, setUrl] = useState<string | null>(null),
    [error, setError] = useState<string | null>(null),
    [busy, setBusy] = useState(false)
  const preview = async (index: number) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const component = snapshot.payload.components[index]
      const doc = applyLibrary(
        await scaffold.mutateAsync(snapshot.payload.framework),
        snapshot
      )
      const source = component.example ?? component.path
      const name = component.example ? "default" : component.exportName
      const statement = `import ${name === "default" ? "Example" : `{ ${name} as Example }`} from ${JSON.stringify("../" + libraryPrefix(snapshot.libraryId) + source)};`
      doc.files[doc.kind === "vue-vite" ? "src/App.vue" : "src/App.tsx"] =
        doc.kind === "vue-vite"
          ? `<script setup lang="ts">${statement}</script><template><Example /></template>`
          : `${statement}\nexport default function App(){return <Example />}`
      setUrl(await startSiteRuntime(doc, undefined, () => undefined))
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Aperçu indisponible."
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <SearchField
        value={query}
        onValueChange={setQuery}
        label="Rechercher un composant"
        placeholder="Rechercher un composant…"
      />
      <div className="divide-y rounded-md border">
        {snapshot.payload.components
          .map((component, index) => ({ component, index }))
          .filter(({ component }) =>
            (component.name + component.description)
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map(({ component, index }) => (
            <div
              key={`${component.path}:${component.exportName}`}
              className="flex flex-col gap-2 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{component.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={
                    busy ||
                    (!component.example &&
                      Object.values(component.props).some(
                        (type) => !type.includes("optionnel")
                      ))
                  }
                  onClick={() => void preview(index)}
                >
                  Aperçu
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {component.description || component.path}
              </p>
              <code className="text-xs break-all">
                {component.exportName === "default"
                  ? `import ${component.name}`
                  : `import { ${component.exportName} }`}{" "}
                from "@/libraries/{snapshot.libraryId}/{component.path}"
              </code>
              <div className="flex flex-wrap gap-1">
                {Object.entries(component.props).map(([name, type]) => (
                  <Badge key={name} variant="secondary">
                    {name}: {type}
                  </Badge>
                ))}
              </div>
              {!component.example &&
                Object.values(component.props).some(
                  (type) => !type.includes("optionnel")
                ) && (
                  <p className="text-xs text-muted-foreground">
                    Un exemple avec les props requises est nécessaire pour
                    l’aperçu.
                  </p>
                )}
            </div>
          ))}
        {!snapshot.payload.components.length && (
          <p className="p-4 text-sm text-muted-foreground">
            Aucun composant exporté détecté. Déclarez ses exports dans
            studio.library.json.
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Dialog
        open={url !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUrl(null)
            void disposeSiteRuntime()
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aperçu du composant</DialogTitle>
            <DialogDescription>
              Exemple isolé de la version {snapshot.version}.
            </DialogDescription>
          </DialogHeader>
          {url && (
            <iframe
              title="Aperçu de bibliothèque"
              sandbox="allow-scripts allow-same-origin allow-forms"
              src={url}
              className="h-96 w-full rounded-md border bg-background"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
