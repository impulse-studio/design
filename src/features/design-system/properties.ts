import type { CatalogEntry } from "./types"

export type PropertyRow = {
  name: string
  type: string
  defaultValue: string
  description: string
}
const compositionProps: Record<string, PropertyRow[]> = {
  "status-icon": [
    {
      name: "status",
      type: "StatusValue",
      defaultValue: "Requis",
      description: "Backlog, à faire, en cours, terminé, annulé ou doublon.",
    },
    {
      name: "progress",
      type: "number",
      defaultValue: "50",
      description: "Remplissage du cercle en cours, entre 0 et 100.",
    },
    {
      name: "tone",
      type: "semantic | neutral",
      defaultValue: "semantic",
      description: "Couleurs de statut ou variante monochrome.",
    },
    {
      name: "label",
      type: "string",
      defaultValue: "—",
      description: "Nom accessible lorsque l’icône est utilisée seule.",
    },
  ],
  "status-picker": [
    {
      name: "value",
      type: "StatusValue",
      defaultValue: "Requis",
      description: "Statut sélectionné, géré par le parent.",
    },
    {
      name: "onValueChange",
      type: "(value: StatusValue) => void",
      defaultValue: "Requis",
      description: "Appelé à la sélection, au clic ou au clavier.",
    },
  ],
  "page-header": [
    {
      name: "title",
      type: "string",
      defaultValue: "Requis",
      description: "Titre principal de la page.",
    },
    {
      name: "description / eyebrow",
      type: "string",
      defaultValue: "—",
      description: "Contexte et repère de navigation.",
    },
    {
      name: "actions",
      type: "ReactNode",
      defaultValue: "—",
      description: "Actions composées avec les primitives Button.",
    },
  ],
  "search-field": [
    {
      name: "value",
      type: "string",
      defaultValue: "Requis",
      description: "Valeur contrôlée de la recherche.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      defaultValue: "Requis",
      description: "Appelé à chaque saisie et à l’effacement.",
    },
    {
      name: "label / placeholder",
      type: "string",
      defaultValue: "Rechercher",
      description: "Libellé accessible et aide à la saisie.",
    },
  ],
  "filter-bar": [
    {
      name: "children / actions",
      type: "ReactNode",
      defaultValue: "—",
      description: "Filtres et actions placés dans deux groupes.",
    },
  ],
  "settings-section": [
    {
      name: "title",
      type: "string",
      defaultValue: "Requis",
      description: "Titre accessible de la section.",
    },
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "Requis",
      description: "Champs shadcn Field.",
    },
    {
      name: "description / footer",
      type: "string / ReactNode",
      defaultValue: "—",
      description: "Contexte et actions de fin de section.",
    },
  ],
  "date-picker": [
    {
      name: "value",
      type: "Date | undefined",
      defaultValue: "—",
      description: "Date sélectionnée, gérée par le parent.",
    },
    {
      name: "onValueChange",
      type: "(date?: Date) => void",
      defaultValue: "Requis",
      description: "Retourne la sélection et ferme le calendrier.",
    },
    {
      name: "label",
      type: "string",
      defaultValue: "Choisir une date",
      description: "Libellé du bouton et nom accessible.",
    },
  ],
  "data-table": [
    {
      name: "data / columns",
      type: "TData[] / ColumnDef[]",
      defaultValue: "Requis",
      description: "Données et colonnes typées avec DataTableFeatures.",
    },
    {
      name: "filterColumn",
      type: "string",
      defaultValue: "—",
      description: "Identifiant de la colonne filtrée par la recherche.",
    },
    {
      name: "pageSize",
      type: "number",
      defaultValue: "5",
      description: "Nombre de lignes par page.",
    },
    {
      name: "emptyMessage",
      type: "string",
      defaultValue: "Aucun résultat.",
      description: "Texte affiché quand la liste est vide.",
    },
  ],
}
export const getProperties = (entry: CatalogEntry): PropertyRow[] => {
  const rows = [...(compositionProps[entry.id] ?? [])]
  if (entry.variants.length > 1 && entry.id !== "status-icon")
    rows.push({
      name:
        (
          {
            direction: "direction",
            attachment: "state",
            toast: "type",
            "filter-bar": "density",
            tabs: "TabsList.variant",
            select: "SelectTrigger.variant",
          } as Record<string, string>
        )[entry.id] ?? "variant",
      type: entry.variants.join(" | "),
      defaultValue: entry.variants[0],
      description: "Intention visuelle ou comportement de l’exemple.",
    })
  if (entry.sizes.length > 1)
    rows.push({
      name: entry.id === "input" ? "controlSize" : "size",
      type: entry.sizes.join(" | "),
      defaultValue: entry.sizes[0],
      description: "Taille prévue par le composant.",
    })
  if (entry.states.includes("disabled"))
    rows.push({
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Désactive le contrôle et ses interactions.",
    })
  if (entry.states.includes("invalid"))
    rows.push({
      name: "aria-invalid",
      type: "boolean",
      defaultValue: "false",
      description: "Associer à un message d’erreur visible et accessible.",
    })
  return rows
}
