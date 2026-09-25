import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useExample } from "@/features/design-system/use-example"
import { defaultOptions } from "@/features/design-system/types"
import type {
  CatalogEntry,
  ExampleOptions,
} from "@/features/design-system/types"

export function ExamplePreview({
  entry,
  options,
}: {
  entry: CatalogEntry
  options?: ExampleOptions
}) {
  const { module, error } = useExample(entry)
  if (error)
    return (
      <Alert>
        <AlertTitle>Aperçu indisponible</AlertTitle>
        <AlertDescription>Rechargez la page pour réessayer.</AlertDescription>
      </Alert>
    )
  if (!module)
    return (
      <div
        className="flex w-full max-w-xs flex-col gap-3"
        role="status"
        aria-label="Chargement de l’aperçu"
      >
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    )
  return <module.Component options={options ?? defaultOptions(entry)} />
}
