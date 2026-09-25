import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useOrpc } from "@/server/use-orpc"

export function LibraryConnection({
  libraryId,
  onChanged,
}: {
  libraryId: string
  onChanged: () => Promise<void>
}) {
  const orpc = useOrpc(),
    connect = useMutation(orpc.libraries.connect.mutationOptions())
  const [code, setCode] = useState<string | null>(null),
    [error, setError] = useState<string | null>(null)
  const create = async () => {
    if (connect.isPending) return
    setError(null)
    try {
      const result = await connect.mutateAsync({ libraryId })
      setCode(result.code)
      await onChanged()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Connexion impossible."
      )
    }
  }
  return (
    <div className="flex flex-col gap-3 rounded-md border p-4">
      <div>
        <h3 className="text-sm font-medium">Synchroniser un dossier local</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Les changements du PC publient une nouvelle version de la
          bibliothèque. Vos projets choisissent quand l’adopter.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={connect.isPending}
        onClick={() => void create()}
      >
        Générer un code de connexion
      </Button>
      {code && (
        <div className="flex flex-col gap-2 text-xs">
          <p>Code valable 10 minutes, utilisable une fois :</p>
          <code className="rounded bg-muted p-2 break-all select-all">
            {code}
          </code>
          <p>Sur le PC contenant la bibliothèque, lancez :</p>
          <code className="rounded bg-muted p-2 break-all select-all">
            node scripts/libraries/library-connect.mjs {window.location.origin}{" "}
            "/chemin/vers/bibliotheque"
          </code>
          <p className="text-muted-foreground">
            Saisissez le code dans le terminal. Laissez le connecteur ouvert ;
            Ctrl+C arrête la synchronisation. Aucune écriture dans le dossier
            local.
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
