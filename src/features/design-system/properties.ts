import type { CatalogDefinition, PropertyRow } from "./types"

export const getProperties = (entry: CatalogDefinition): PropertyRow[] => {
  const rows = [...(entry.properties ?? [])]
  if (entry.variants.length > 1 && entry.variantProperty !== null)
    rows.push({
      name: entry.variantProperty ?? "variant",
      type: entry.variants.join(" | "),
      defaultValue: entry.variants[0],
      description: "Intention visuelle ou comportement de l’exemple.",
    })
  if (entry.sizes.length > 1)
    rows.push({
      name: entry.sizeProperty ?? "size",
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
