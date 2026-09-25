import { v4 as uuid } from "uuid"
import { useRef, useState } from "react"
import { useForm, revalidateLogic } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"
import { FormTextField } from "@/components/shared/FormTextField"
import { OptionSelect } from "@/components/shared/OptionSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { libraryFormSchema } from "@/validators/libraries/forms"
import { frameworkOptions } from "@/features/sites/frameworks"
import {
  readLibraryFiles,
  droppedLibraryFiles,
} from "@/features/libraries/import"
import { libraryValidationDocument } from "@/features/libraries/merge"
import type { LibrarySnapshot } from "@/features/libraries/types"
import { librarySnapshotSchema } from "@/validators/libraries/payload"
import { validateSiteRuntime } from "@/features/sites/runtime"
import type { SiteKind } from "@/validators/sites/kind"

export function LibraryImportForm({
  existing,
  onSaved,
}: {
  existing?: LibrarySnapshot
  onSaved: () => Promise<void>
}) {
  const orpc = useOrpc(),
    publish = useMutation(orpc.libraries.publish.mutationOptions()),
    scaffold = useMutation(orpc.sites.scaffold.mutationOptions())
  const [files, setFiles] = useState<File[]>([]),
    [error, setError] = useState<string | null>(null)
  const selecting = useRef(false)
  const form = useForm({
    defaultValues: {
      name: existing?.name ?? "",
      framework: existing?.payload.framework ?? "react-vite",
    },
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: { onDynamic: libraryFormSchema },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const values = libraryFormSchema.parse(value)
        if (!files.length)
          throw new Error("Sélectionnez les fichiers de votre bibliothèque.")
        const payload = await readLibraryFiles(files, values.framework)
        const validationSnapshot = librarySnapshotSchema.parse({
          id: uuid(),
          libraryId: existing?.libraryId ?? uuid(),
          name: values.name,
          version: (existing?.version ?? 0) + 1,
          payload,
        })
        const base = await scaffold.mutateAsync(payload.framework)
        await validateSiteRuntime(
          libraryValidationDocument(validationSnapshot, base)
        )
        await publish.mutateAsync({
          name: values.name,
          libraryId: existing?.libraryId,
          expectedVersion: existing?.version ?? 0,
          payload,
        })
        await onSaved()
      } catch (reason) {
        setError(
          reason instanceof Error ? reason.message : "Import impossible."
        )
      }
    },
  })
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!form.state.isSubmitting) void form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(field) => (
          <FormTextField
            field={field}
            label="Nom de la bibliothèque"
            maxLength={100}
            required
            disabled={publish.isPending}
          />
        )}
      </form.Field>
      <form.Field name="framework">
        {(field) => (
          <OptionSelect
            value={field.state.value}
            onValueChange={(v) => field.handleChange(v as SiteKind)}
            label="Framework"
            options={frameworkOptions}
            disabled={!!existing || publish.isPending}
          />
        )}
      </form.Field>
      <div
        className="flex flex-col gap-3 rounded-md border border-dashed p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (publish.isPending || selecting.current) return
          selecting.current = true
          void droppedLibraryFiles(e.dataTransfer.items)
            .then(setFiles)
            .catch((reason) => setError(String(reason)))
            .finally(() => {
              selecting.current = false
            })
        }}
      >
        <p className="text-sm">
          Déposez vos fichiers, un dossier ou une archive ZIP.
        </p>
        <Input
          type="file"
          multiple
          aria-label="Importer des fichiers ou un ZIP"
          aria-invalid={!!error}
          aria-describedby={error ? "library-import-error" : undefined}
          disabled={publish.isPending}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        <Input
          type="file"
          multiple
          {...({ webkitdirectory: "" } as Record<string, string>)}
          aria-label="Importer un dossier"
          disabled={publish.isPending}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        <p className="text-xs text-muted-foreground" role="status">
          {files.length
            ? `${files.length} fichier(s) sélectionné(s)`
            : "Composants, styles et assets · 250 fichiers, 10 Mo maximum"}
        </p>
      </div>
      {existing && (
        <p className="text-xs text-muted-foreground">
          Cet import remplace le contenu de la bibliothèque dans une nouvelle
          version. Les projets existants restent inchangés.
        </p>
      )}
      {error && (
        <p
          id="library-import-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(pending) => (
          <Button type="submit" disabled={pending || !files.length}>
            {pending ? "Validation et publication…" : "Publier la bibliothèque"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
