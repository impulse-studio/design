import { v4 as uuid } from "uuid"
import type {
  LocalComponentVariant,
  LibraryManifest,
  ManifestComponent,
  MockupDoc,
  Node,
  ComponentNode,
  Json,
} from "@digit-ai-studio/shared"
import { propOptions, librarySchema, walk } from "@digit-ai-studio/shared"
import { framesOf } from "./document"
import data from "../../../manifest/manifest.json"

export const library: LibraryManifest = librarySchema.parse(data)
export const libraryEntries = [...library.templates, ...library.components]
export const entryFor = (name: string) =>
  libraryEntries.find((entry) => entry.name === name)
export type LocalVariantEntry = {
  component: string
  variant: LocalComponentVariant
}
export const localVariantsOf = (
  doc: MockupDoc,
  component?: string
): LocalVariantEntry[] => {
  const variants = new Map<string, LocalVariantEntry>()
  for (const frame of framesOf(doc))
    walk(frame, (node) => {
      if (
        node.type === "component" &&
        node.localVariant &&
        (!component || node.component === component)
      )
        variants.set(node.localVariant.id, {
          component: node.component,
          variant: node.localVariant,
        })
    })
  return [...variants.values()].sort((a, b) =>
    a.variant.name.localeCompare(b.variant.name)
  )
}

export const textNode = (content = "Votre texte"): Node => ({
  id: uuid(),
  type: "text",
  content,
  fontSize: 16,
  color: { token: "foreground" },
})
export const boxNode = (): Node => ({
  id: uuid(),
  type: "box",
  name: "Conteneur",
  autoLayout: {
    direction: "column",
    gap: 16,
    padding: [24, 24, 24, 24],
    align: "stretch",
  },
  layout: { width: { mode: "fixed", value: 320 }, height: { mode: "hug" } },
  children: [],
  style: { background: { token: "muted" }, radius: 8 },
})

const component = (
  name: string,
  props: Record<string, Json> = {},
  slots?: Record<string, Node[]>
): ComponentNode => {
  const entry = entryFor(name)
  return {
    id: uuid(),
    type: "component",
    component: name,
    props: { ...entry?.previewProps, ...props },
    ...(slots ? { slots } : {}),
  }
}
const recipes: Partial<Record<string, () => Node>> = {
  DigiButton: () => ({
    ...component("DigiButton", { variant: "primary" }),
    text: "Continuer",
  }),
  DigiIconButton: () =>
    component("DigiIconButton", { iconName: "add-line", tooltip: "Ajouter" }),
  DigiPopover: () =>
    component(
      "DigiPopover",
      {},
      {
        default: [
          component(
            "DigiPopoverTrigger",
            {},
            { default: [textNode("Ouvrir les options")] }
          ),
          component(
            "DigiPopoverContent",
            { title: "Options" },
            { default: [textNode("Personnalisez votre contenu.")] }
          ),
        ],
      }
    ),
  DigiToggleGroup: () =>
    component(
      "DigiToggleGroup",
      { type: "single", modelValue: "a" },
      {
        default: ["a", "b"].map((value) =>
          component(
            "DigiToggleGroupItem",
            { value },
            { default: [textNode(value === "a" ? "Liste" : "Grille")] }
          )
        ),
      }
    ),
  DigiBadge: () => component("DigiBadge", { text: "Nouveau", color: "blue" }),
  DigiAlert: () =>
    component("DigiAlert", {
      title: "Une information utile",
      description: "Ajoutez votre message ici.",
      variant: "info",
    }),
  DigiAccordion: () =>
    component(
      "DigiAccordion",
      { type: "single", collapsible: true },
      {
        default: [
          component(
            "DigiAccordionItem",
            { value: "item-1" },
            {
              default: [
                component(
                  "DigiAccordionTrigger",
                  {},
                  { default: [textNode("Informations pratiques")] }
                ),
                component(
                  "DigiAccordionContent",
                  {},
                  {
                    default: [textNode("Ajoutez le contenu de votre section.")],
                  }
                ),
              ],
            }
          ),
        ],
      }
    ),
  DigiTable: () =>
    component(
      "DigiTable",
      {},
      {
        default: [
          component(
            "DigiTableHeader",
            {},
            {
              default: [
                component(
                  "DigiTableRow",
                  {},
                  {
                    default: ["Nom", "E-mail", "Statut"].map((label) =>
                      component(
                        "DigiTableHead",
                        {},
                        { default: [textNode(label)] }
                      )
                    ),
                  }
                ),
              ],
            }
          ),
          component(
            "DigiTableBody",
            {},
            {
              default: [
                ["Alex Martin", "alex@example.com", "Inscrit"],
                ["Camille Dubois", "camille@example.com", "Invité"],
              ].map((row) =>
                component(
                  "DigiTableRow",
                  {},
                  {
                    default: row.map((label) =>
                      component(
                        "DigiTableCell",
                        {},
                        { default: [textNode(label)] }
                      )
                    ),
                  }
                )
              ),
            }
          ),
        ],
      }
    ),
}

export const makeLibraryNode = (entry: ManifestComponent): Node => {
  if (entry.name === "EventLayout")
    return {
      id: uuid(),
      type: "template",
      template: "EventLayout",
      name: "Shell Digitevent",
      props: {},
      slots: {
        content: [
          {
            ...boxNode(),
            name: "Contenu",
            layout: { width: { mode: "fill" }, height: { mode: "fill" } },
            style: {},
          },
        ],
      },
    }
  const recipe = recipes[entry.name]
  if (recipe) return recipe()
  const node = component(entry.name)
  node.props ??= {}
  for (const prop of entry.props) {
    if (prop.required && !Object.hasOwn(node.props, prop.name)) {
      const options = propOptions(prop)
      if (options.length) node.props[prop.name] = options[0]!
      else if (prop.type === "string") node.props[prop.name] = "Exemple"
      else if (prop.type === "number") node.props[prop.name] = 0
      else if (/^(false \| true|boolean)$/.test(prop.type))
        node.props[prop.name] = false
    }
  }
  if (entry.slots.includes("default"))
    node.slots = { default: [textNode(entry.name.replace(/^Digi/, ""))] }
  return node
}
// Root components and composable recipes are offered for insertion. Context-only children remain visible in the library.
export const insertionIssue = (entry: ManifestComponent): string | null => {
  if (recipes[entry.name] || entry.name === "EventLayout") return null
  if (
    /Provider$|Trigger$|Content$|Item$|^DigiTable(?:Head|Body|Row|Cell|Footer|Caption)/.test(
      entry.name
    )
  )
    return "À composer dans son composant parent"
  if (entry.props.some((prop) => prop.required && /=>/.test(prop.type)))
    return "Nécessite une fonction métier"
  const initial = makeLibraryNode(entry)
  if (
    initial.type === "component" &&
    entry.props.some(
      (prop) => prop.required && initial.props?.[prop.name] === undefined
    )
  )
    return "Nécessite une configuration métier"
  if (
    /FormField|^Digi(?:Form|NudeForm|ModalForm|SingleSetting)/.test(entry.name)
  )
    return "À composer dans un formulaire métier"
  return null
}
