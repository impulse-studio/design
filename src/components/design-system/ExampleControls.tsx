import { useId } from "react"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RiRestartLine } from "@remixicon/react"
import type {
  CatalogEntry,
  ExampleOptions,
} from "@/features/design-system/types"
import { defaultOptions } from "@/features/design-system/types"

const labels: Record<string, string> = {
  default: "Par défaut",
  sm: "Petit",
  lg: "Grand",
  xs: "Très petit",
  disabled: "Désactivé",
  invalid: "Erreur",
  loading: "Chargement",
  secondary: "Secondaire",
  outline: "Contour",
  ghost: "Discret",
  destructive: "Destructif",
  link: "Lien",
  subtle: "Fond gris",
  semantic: "Couleurs de statut",
  neutral: "Monochrome",
}
export function ExampleControls({
  entry,
  options,
  onChange,
  onReset,
}: {
  entry: CatalogEntry
  options: ExampleOptions
  onChange: (options: ExampleOptions) => void
  onReset: () => void
}) {
  const id = useId()
  const choices = [
    { key: "variant" as const, label: "Variante", values: entry.variants },
    { key: "size" as const, label: "Taille", values: entry.sizes },
    { key: "state" as const, label: "État", values: entry.states },
  ].filter((choice) => choice.values.length > 1)
  return (
    <aside className="flex w-full flex-col gap-5 border-t bg-background p-4 lg:w-60 lg:shrink-0 lg:border-t-0 lg:border-l">
      {choices.length > 0 && (
        <p className="text-xs font-medium text-muted-foreground">Propriétés</p>
      )}
      {choices.length > 0 && (
        <FieldGroup className="gap-2">
          {choices.map((choice) => (
            <Field
              key={choice.key}
              orientation="horizontal"
              className="grid grid-cols-[4rem_minmax(0,1fr)] gap-2"
            >
              <FieldLabel
                htmlFor={`${id}-${choice.key}`}
                className="w-16 shrink-0 text-xs font-normal text-muted-foreground"
              >
                {choice.label}
              </FieldLabel>
              <Select
                items={choice.values.map((value) => ({
                  value,
                  label: labels[value] ?? value,
                }))}
                value={options[choice.key]}
                onValueChange={(value) => {
                  if (value !== null)
                    onChange({ ...options, [choice.key]: value })
                }}
              >
                <SelectTrigger
                  id={`${id}-${choice.key}`}
                  size="sm"
                  variant="ghost"
                  className="w-full min-w-0"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectGroup>
                    {choice.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {labels[value] ?? value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ))}
        </FieldGroup>
      )}
      <div className="mt-auto border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange(defaultOptions(entry))
            onReset()
          }}
        >
          <RiRestartLine data-icon="inline-start" />
          Réinitialiser
        </Button>
      </div>
    </aside>
  )
}
