import type { CatalogEntry } from "./types"

const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
const aliases: Record<string, string[]> = {
  button: ["bouton"],
  input: ["champ", "saisie"],
  select: ["sélecteur"],
  switch: ["interrupteur"],
  checkbox: ["case à cocher"],
  dialog: ["modale", "fenêtre"],
  sheet: ["panneau latéral"],
  drawer: ["tiroir"],
  badge: ["étiquette", "statut"],
  table: ["tableau"],
  tabs: ["onglets"],
  tooltip: ["infobulle"],
  card: ["carte"],
  toast: ["notification"],
  "radio-group": ["boutons radio"],
  "data-table": ["tableau", "données"],
  "date-picker": ["date", "calendrier"],
  "button-group": ["boutons"],
  "dropdown-menu": ["menu déroulant"],
  "context-menu": ["menu contextuel"],
}
export const catalogSearchText = (entry: CatalogEntry) =>
  [
    entry.name,
    entry.id,
    entry.description,
    entry.category,
    ...(aliases[entry.id] ?? []),
  ].join(" ")
export const matchesSearch = (text: string, query: string) =>
  normalizeSearch(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => normalizeSearch(text).includes(term))
export const searchCatalog = (entries: CatalogEntry[], query: string) =>
  entries.filter((entry) => matchesSearch(catalogSearchText(entry), query))
