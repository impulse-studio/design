import {
  elementAttributesSchema,
  elementInlineStyleSchema,
  elementTagSchema,
} from "@digit-ai-studio/shared"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { useSelection } from "@/features/editor/use-selection"
import { useEditor } from "@/features/editor/context"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import {
  INVALID_DRAFT,
  useDraftEdit,
} from "@/components/shared/fields/use-draft-edit"

export function ElementSection() {
  const { nodes, common, apply, state } = useSelection()
  const editor = useEditor()
  const attributesValue = common((node) =>
    node.type === "element"
      ? JSON.stringify(node.attributes ?? {}, null, 2)
      : ""
  )
  const attributesEdit = useDraftEdit<
    string,
    Record<string, string | number | boolean>,
    HTMLTextAreaElement
  >({
    value: attributesValue ?? "{}",
    format: (value) => value,
    parse: (draft) => {
      try {
        const parsed: unknown = JSON.parse(draft)
        const result = elementAttributesSchema.safeParse(parsed)
        return result.success ? result.data : INVALID_DRAFT
      } catch {
        return INVALID_DRAFT
      }
    },
    apply: (attributes) => {
      apply((node) => {
        if (node.type === "element") node.attributes = attributes
      })
      return JSON.stringify(attributes, null, 2)
    },
    identity: state.selectedIds.join(","),
    selectOnFocus: false,
  })
  if (!nodes.length || !nodes.every((node) => node.type === "element"))
    return null
  return (
    <InspectorSection title="Structure HTML">
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-tag">Balise</FieldLabel>
        <Input
          id="element-tag"
          value={
            common((node) =>
              node.type === "element" ? node.tag : undefined
            ) ?? ""
          }
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => {
            const value = event.target.value.toLowerCase()
            if (elementTagSchema.safeParse(value).success)
              apply((node) => {
                if (node.type === "element") node.tag = value
              })
          }}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-class">Classes</FieldLabel>
        <Input
          id="element-class"
          value={
            common((node) =>
              node.type === "element" ? (node.className ?? "") : undefined
            ) ?? ""
          }
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => {
            const value = event.target.value
            if (value.length <= 4000)
              apply((node) => {
                if (node.type === "element") node.className = value
              })
          }}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-style">Styles CSS</FieldLabel>
        <Textarea
          id="element-style"
          value={
            common((node) =>
              node.type === "element" ? (node.inlineStyle ?? "") : undefined
            ) ?? ""
          }
          rows={3}
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => {
            const value = event.target.value
            if (elementInlineStyleSchema.safeParse(value).success)
              apply((node) => {
                if (node.type === "element") node.inlineStyle = value
              })
          }}
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel htmlFor="element-attributes">Attributs JSON</FieldLabel>
        <Textarea
          id="element-attributes"
          value={attributesEdit.draft}
          aria-invalid={attributesEdit.invalid}
          rows={4}
          onFocus={attributesEdit.onFocus}
          onBlur={attributesEdit.onBlur}
          onKeyDown={attributesEdit.onKeyDown}
          onChange={(event) => attributesEdit.setDraft(event.target.value)}
        />
        {attributesEdit.invalid && (
          <p className="text-xs text-destructive">
            Objet JSON attendu, avec des attributs simples et sûrs.
          </p>
        )}
      </Field>
    </InspectorSection>
  )
}
