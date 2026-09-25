import type { MockupDoc } from "../doc"
import type { LibraryManifest, ManifestComponent } from "../manifest"
import { propOptions } from "../manifest"
import { walk } from "../tree"

import { documentSchema } from "./document"

export const validateDocument = (
  input: unknown,
  manifest: LibraryManifest
): MockupDoc => {
  const doc = documentSchema.parse(input)
  const entries = new Map<string, ManifestComponent>(
    [...manifest.components, ...manifest.templates].map((entry) => [
      entry.name,
      entry,
    ])
  )
  for (const page of doc.pages)
    for (const frame of page.frames)
      walk(frame, (node) => {
        if (node.type !== "component" && node.type !== "template") return
        const name = node.type === "component" ? node.component : node.template
        const entry = entries.get(name)
        if (!entry) throw new Error(`Composant inconnu : ${name}`)
        const propValues = {
          ...(node.type === "component" ? node.localVariant?.props : {}),
          ...(node.props ?? {}),
        }
        for (const [key, value] of Object.entries(propValues)) {
          const prop = entry.props.find((candidate) => candidate.name === key)
          if (!prop || /^on[A-Z]/.test(key) || /=>/.test(prop.type))
            throw new Error(`Propriété non éditable : ${name}.${key}`)
          const options = propOptions(prop)
          const type = prop.type.replace(/\s*\|\s*undefined/g, "").trim()
          if (type === "false | true" && typeof value !== "boolean")
            throw new Error(`Type invalide : ${name}.${key}`)
          if (options.length && !options.includes(String(value)))
            throw new Error(`Valeur invalide : ${name}.${key}`)
          if (
            ["string", "number", "boolean"].includes(type) &&
            typeof value !== type
          )
            throw new Error(`Type invalide : ${name}.${key}`)
        }
        for (const prop of entry.props)
          if (
            prop.required &&
            !/=>/.test(prop.type) &&
            !(prop.name in propValues)
          )
            throw new Error(`Propriété requise : ${name}.${prop.name}`)
        for (const slot of Object.keys(node.slots ?? {}))
          if (!entry.slots.includes(slot))
            throw new Error(`Slot inconnu : ${name}.${slot}`)
      })
  return doc
}
