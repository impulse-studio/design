import { useEffect, useState } from "react"
import type { Json } from "@digit-ai-studio/shared"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { useSelection } from "@/features/editor/use-selection"
import { useEditor } from "@/features/editor/context"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"

const safeTag = (value: string) =>
  /^[a-z][a-z0-9-]{0,40}$/.test(value) &&
  !["script", "style", "iframe", "object", "embed", "link", "meta"].includes(value)
const safeStyle = (value: string) =>
  value.length <= 4000 && !/(?:url\s*\(|expression\s*\(|javascript:|@import|<)/i.test(value)

export function ElementSection() {
  const { nodes, common, apply, state } = useSelection()
  const editor = useEditor()
  const [attributesDraft, setAttributesDraft] = useState("")
  const attributesValue = common((node) =>
    node.type === "element" ? JSON.stringify(node.attributes ?? {}, null, 2) : ""
  )
  useEffect(() => setAttributesDraft(attributesValue ?? "{}"), [attributesValue, state.selectedIds])
  if (!nodes.length || !nodes.every((node) => node.type === "element")) return null
  return (
    <InspectorSection title="Structure HTML">
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-tag">Balise</FieldLabel>
        <Input
          id="element-tag"
          value={common((node) => node.type === "element" ? node.tag : undefined) ?? ""}
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => {
            const value = event.target.value.toLowerCase()
            if (safeTag(value)) apply((node) => { if (node.type === "element") node.tag = value })
          }}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-class">Classes</FieldLabel>
        <Input
          id="element-class"
          value={common((node) => node.type === "element" ? node.className ?? "" : undefined) ?? ""}
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => apply((node) => { if (node.type === "element") node.className = event.target.value })}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-style">Styles CSS</FieldLabel>
        <Textarea
          id="element-style"
          value={common((node) => node.type === "element" ? node.inlineStyle ?? "" : undefined) ?? ""}
          rows={3}
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => {
            const value = event.target.value
            if (safeStyle(value)) apply((node) => { if (node.type === "element") node.inlineStyle = value })
          }}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-attributes">Attributs JSON</FieldLabel>
        <Textarea
          id="element-attributes"
          value={attributesDraft}
          rows={4}
          onFocus={editor.begin}
          onBlur={(event) => {
            try {
              const parsed: unknown = JSON.parse(event.currentTarget.value)
              if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Objet attendu")
              const attributes = parsed as Record<string, Json>
              if (Object.entries(attributes).some(([key, value]) =>
                /^on/i.test(key) || key.toLowerCase() === "srcdoc" ||
                !(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
              )) throw new Error("Attributs simples requis")
              apply((node) => {
                if (node.type === "element")
                  node.attributes = attributes as Record<string, string | number | boolean>
              })
              editor.commit()
            } catch {
              editor.cancel()
              setAttributesDraft(attributesValue ?? "{}")
              editor.set({ notice: "Les attributs doivent être un objet JSON de valeurs simples sans événement." })
            }
          }}
          onChange={(event) => setAttributesDraft(event.target.value)}
        />
      </Field>
    </InspectorSection>
  )
}
