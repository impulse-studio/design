import {
  inspectorFormSchema,
  inspectorTextSchema,
} from "@/validators/sites/forms"
import { sourceElementName } from "@/features/sites/element-name"
import { useMemo } from "react"
import { useForm } from "@tanstack/react-form"

import { OptionSelect } from "@/components/shared/OptionSelect"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SiteInspectorSection } from "./InspectorSection"
import { visualEditSchema } from "@/validators/sites/document"
import type {
  Breakpoint,
  SiteChange,
  SiteDocument,
  StyleProperty,
} from "@/validators/sites/document"
import type { SourceElement } from "@/features/sites/source"

const labels: Record<StyleProperty, string> = {
  padding: "Padding uniforme",
  paddingTop: "Padding haut",
  paddingRight: "Padding droite",
  paddingBottom: "Padding bas",
  paddingLeft: "Padding gauche",
  margin: "Marge",
  gap: "Gap",
  width: "Largeur",
  height: "Hauteur",
  maxWidth: "Largeur maximale",
  minHeight: "Hauteur minimale",
  color: "Couleur du texte",
  backgroundColor: "Couleur de fond",
  fontSize: "Taille du texte",
  fontWeight: "Graisse",
  lineHeight: "Interligne",
  borderRadius: "Arrondi",
  display: "Disposition",
  flexDirection: "Direction",
  alignItems: "Alignement vertical",
  justifyContent: "Alignement horizontal",
  gridTemplateColumns: "Colonnes de grille",
}
const styleGroups: {
  title: string
  properties: StyleProperty[]
  defaultOpen?: boolean
}[] = [
  {
    title: "Disposition",
    properties: [
      "display",
      "flexDirection",
      "gap",
      "alignItems",
      "justifyContent",
      "gridTemplateColumns",
    ],
    defaultOpen: true,
  },
  {
    title: "Dimensions",
    properties: ["width", "height", "maxWidth", "minHeight"],
    defaultOpen: true,
  },
  {
    title: "Espacement",
    properties: [
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "margin",
    ],
  },
  {
    title: "Typographie",
    properties: ["color", "fontSize", "fontWeight", "lineHeight"],
  },
  {
    title: "Apparence",
    properties: ["backgroundColor", "borderRadius"],
  },
]
const propertyOptions: Partial<
  Record<StyleProperty, { value: string; label: string }[]>
> = {
  display: [
    { value: "block", label: "Bloc" },
    { value: "inline-block", label: "Bloc en ligne" },
    { value: "flex", label: "Flex" },
    { value: "inline-flex", label: "Flex en ligne" },
    { value: "grid", label: "Grille" },
    { value: "none", label: "Masqué" },
  ],
  flexDirection: [
    { value: "row", label: "Ligne" },
    { value: "column", label: "Colonne" },
    { value: "row-reverse", label: "Ligne inversée" },
    { value: "column-reverse", label: "Colonne inversée" },
  ],
  alignItems: [
    { value: "start", label: "Début" },
    { value: "flex-start", label: "Début flex" },
    { value: "center", label: "Centre" },
    { value: "end", label: "Fin" },
    { value: "flex-end", label: "Fin flex" },
    { value: "stretch", label: "Étirer" },
    { value: "baseline", label: "Ligne de base" },
  ],
  justifyContent: [
    { value: "start", label: "Début" },
    { value: "flex-start", label: "Début flex" },
    { value: "center", label: "Centre" },
    { value: "end", label: "Fin" },
    { value: "flex-end", label: "Fin flex" },
    { value: "space-between", label: "Répartir" },
    { value: "space-around", label: "Espacer autour" },
    { value: "space-evenly", label: "Espacer également" },
  ],
  fontWeight: [
    { value: "300", label: "Léger" },
    { value: "400", label: "Normal" },
    { value: "normal", label: "Normal CSS" },
    { value: "500", label: "Moyen" },
    { value: "600", label: "Semi-gras" },
    { value: "700", label: "Gras" },
    { value: "bold", label: "Gras CSS" },
  ],
}
const placeholders: Partial<Record<StyleProperty, string>> = {
  padding: "1rem",
  paddingTop: "1rem",
  paddingRight: "1rem",
  paddingBottom: "1rem",
  paddingLeft: "1rem",
  margin: "1rem ou auto",
  gap: "1rem ou var(--spacing-md)",
  width: "100%, 20rem ou auto",
  height: "auto ou 20rem",
  maxWidth: "72rem",
  minHeight: "20rem",
  color: "#334155 ou var(--foreground)",
  backgroundColor: "#ffffff ou var(--surface)",
  fontSize: "1rem ou var(--font-size-body)",
  lineHeight: "1.5",
  borderRadius: "0.5rem ou var(--radius-md)",
  gridTemplateColumns: "1fr 1fr",
}
const inheritedOption = { value: "__inherited__", label: "Hérité" }

export function SiteInspector({
  element,
  doc,
  breakpoint,
  busy,
  canEdit,
  onEdit,
}: {
  element: SourceElement | null
  count: number
  doc: SiteDocument
  breakpoint: Breakpoint
  busy: boolean
  canEdit: boolean
  onEdit: (
    change: Extract<SiteChange, { type: "visual" | "text" }>
  ) => Promise<void>
}) {
  const cssVariables = useMemo(() => {
    const variables = new Map<string, string>()
    for (const [path, source] of Object.entries(doc.files)) {
      if (!path.endsWith(".css")) continue
      for (const [, name, value] of source.matchAll(
        /(--[a-zA-Z][a-zA-Z0-9_-]*)\s*:\s*([^;{}]+)/g
      ))
        variables.set(name, value.trim().replace(/\s*!important$/i, ""))
    }
    for (const visualEdit of doc.visual) {
      for (const [name, value] of Object.entries(visualEdit.styles)) {
        if (name.startsWith("--") && value !== undefined)
          variables.set(name, value)
      }
    }
    return [...variables.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [doc.files, doc.visual])
  const savedStyles = Object.fromEntries(
    Object.entries(
      doc.visual.find(
        (visualEdit) =>
          visualEdit.id === element?.id && visualEdit.breakpoint === breakpoint
      )?.styles ?? {}
    ).filter(([, value]) => typeof value === "string")
  ) as Record<string, string>
  const form = useForm({
    defaultValues: { styles: savedStyles, text: element?.text ?? "" },
    validators: { onSubmit: inspectorFormSchema },
    onSubmit: async ({ value }) => {
      if (!element) return
      const parsed = inspectorFormSchema.parse(value)
      const edit = visualEditSchema.parse({
        id: element.id,
        breakpoint,
        styles: parsed.styles,
      })
      await onEdit({ type: "visual", edit })
    },
  })
  if (!element)
    return (
      <div className="flex flex-col gap-2 px-4 py-6">
        <h2 className="text-sm font-semibold">Édition visuelle</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Sélectionner un élément
        </p>
      </div>
    )

  const variableListId = `site-css-variables-${element.id}`
  return (
    <section className="@container flex min-w-0 flex-col gap-3 px-3 pb-4">
      <div className="flex min-w-0 flex-col gap-1 pt-3">
        <h2 className="text-sm font-semibold tracking-tight">
          {sourceElementName(element)}
        </h2>
        <p className="overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap text-muted-foreground">
          {element.tag} · {element.file}
          {element.line ? `:${element.line}` : ""}
        </p>
      </div>

      <form
        className="min-w-0"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <fieldset
          disabled={busy || !canEdit}
          className="flex min-w-0 flex-col gap-3 border-0 p-0"
        >
          <FieldGroup className="gap-3">
            <form.Field name="styles">
              {(field) => (
                <>
                  <datalist id={variableListId}>
                    {cssVariables.map((variable) => (
                      <option
                        key={variable.name}
                        value={`var(${variable.name})`}
                        label={`${variable.name}: ${variable.value}`}
                      />
                    ))}
                  </datalist>

                  {styleGroups.map((group) => (
                    <SiteInspectorSection
                      key={group.title}
                      title={group.title}
                      defaultOpen={group.defaultOpen}
                    >
                      <div className="grid grid-cols-1 gap-x-2 gap-y-3 @min-[13rem]:grid-cols-2">
                        {group.properties.map((property) => {
                          const propertyId = `site-${element.id}-${property}`
                          const options = propertyOptions[property]
                          const isColor =
                            property === "color" ||
                            property === "backgroundColor"
                          const colorValue = field.state.value[property] ?? ""
                          const hexColorPattern =
                            /^#(?:[\da-f]{3}|[\da-f]{6})$/i
                          const colorPickerValue = hexColorPattern.test(
                            colorValue
                          )
                            ? colorValue.length === 4
                              ? `#${colorValue[1]}${colorValue[1]}${colorValue[2]}${colorValue[2]}${colorValue[3]}${colorValue[3]}`
                              : colorValue
                            : "#000000"
                          return (
                            <Field
                              key={property}
                              className={
                                property === "gridTemplateColumns"
                                  ? "col-span-2 min-w-0 gap-1.5"
                                  : "min-w-0 gap-1.5"
                              }
                            >
                              <FieldLabel
                                htmlFor={propertyId}
                                className="text-xs"
                              >
                                {labels[property]}
                              </FieldLabel>
                              {options ? (
                                <OptionSelect
                                  id={propertyId}
                                  label={labels[property]}
                                  value={
                                    field.state.value[property] ||
                                    inheritedOption.value
                                  }
                                  onValueChange={(value) =>
                                    field.handleChange({
                                      ...field.state.value,
                                      [property]:
                                        value === inheritedOption.value
                                          ? ""
                                          : value,
                                    })
                                  }
                                  options={[inheritedOption, ...options]}
                                  triggerClassName="h-8 text-xs"
                                />
                              ) : (
                                <div className="flex min-w-0 items-center gap-2">
                                  {isColor && (
                                    <Input
                                      type="color"
                                      aria-label={`Choisir ${labels[property].toLowerCase()}`}
                                      className="size-8 shrink-0 cursor-pointer p-1"
                                      value={colorPickerValue}
                                      disabled={
                                        Boolean(colorValue) &&
                                        !hexColorPattern.test(colorValue)
                                      }
                                      onChange={(event) =>
                                        field.handleChange({
                                          ...field.state.value,
                                          [property]: event.target.value,
                                        })
                                      }
                                    />
                                  )}
                                  <Input
                                    id={propertyId}
                                    className="h-8 min-w-0 flex-1 text-xs"
                                    list={variableListId}
                                    placeholder={placeholders[property]}
                                    value={field.state.value[property] ?? ""}
                                    onChange={(event) =>
                                      field.handleChange({
                                        ...field.state.value,
                                        [property]: event.target.value,
                                      })
                                    }
                                  />
                                </div>
                              )}
                            </Field>
                          )
                        })}
                      </div>
                    </SiteInspectorSection>
                  ))}

                  <SiteInspectorSection
                    title={`Variables CSS · ${cssVariables.length}`}
                    defaultOpen={false}
                  >
                    {cssVariables.length ? (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 gap-x-2 gap-y-3 @min-[13rem]:grid-cols-2">
                          {cssVariables.map((variable) => {
                            const variableId = `${variableListId}-${variable.name}`
                            return (
                              <Field
                                key={variable.name}
                                className="min-w-0 gap-1.5"
                              >
                                <FieldLabel
                                  htmlFor={variableId}
                                  className="truncate font-mono text-xs"
                                >
                                  {variable.name}
                                </FieldLabel>
                                <Input
                                  id={variableId}
                                  className="h-8 min-w-0 text-xs"
                                  list={variableListId}
                                  placeholder={variable.value}
                                  value={field.state.value[variable.name] ?? ""}
                                  onChange={(event) =>
                                    field.handleChange({
                                      ...field.state.value,
                                      [variable.name]: event.target.value,
                                    })
                                  }
                                />
                              </Field>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Aucune variable CSS déclarée dans les fichiers du
                        projet.
                      </p>
                    )}
                  </SiteInspectorSection>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Portée :{" "}
                    {breakpoint === "base"
                      ? "toutes les tailles"
                      : breakpoint === "tablet"
                        ? "tablette et mobile"
                        : "mobile uniquement"}
                    . Une valeur vide retire l’ajustement à cette taille.
                  </p>
                  <Button type="submit" disabled={busy || !canEdit}>
                    Appliquer les ajustements
                  </Button>
                </>
              )}
            </form.Field>

            {element.text !== null ? (
              <SiteInspectorSection title="Contenu" defaultOpen={false}>
                <form.Field name="text">
                  {(field) => (
                    <Field className="gap-1.5">
                      <FieldLabel htmlFor={`site-text-${element.id}`}>
                        Texte
                      </FieldLabel>
                      <Textarea
                        id={`site-text-${element.id}`}
                        className="min-h-24 resize-y text-sm"
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || !canEdit}
                  onClick={() => {
                    const text = inspectorTextSchema.parse(
                      form.state.values.text
                    )
                    void onEdit({ type: "text", id: element.id, text })
                  }}
                >
                  Modifier le texte
                </Button>
              </SiteInspectorSection>
            ) : (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Contenu dynamique
              </p>
            )}
          </FieldGroup>
        </fieldset>
      </form>
    </section>
  )
}
