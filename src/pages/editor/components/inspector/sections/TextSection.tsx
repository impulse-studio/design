import type { TextNode } from "@digit-ai-studio/shared"
import { withEditorAlpha } from "@/features/editor/colors"
import { computedNumber } from "@/features/editor/geometry"
import { useSelection } from "@/features/editor/use-selection"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { InspectorColorField } from "@/pages/editor/components/inspector/InspectorColorField"
import { LengthField } from "@/components/shared/fields/LengthField"
import { lengthTokens } from "@/features/editor/tokens"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { useDraftEdit } from "@/components/shared/fields/use-draft-edit"

export function TextSection() {
  const { nodes, common, apply, state } = useSelection()
  const content =
    common((node) =>
      node.type === "text"
        ? node.content
        : node.type === "component"
          ? node.text
          : ""
    ) ?? ""
  const contentEdit = useDraftEdit<string, string, HTMLTextAreaElement>({
    value: content,
    format: (value) => value,
    parse: (draft) => draft,
    apply: (next) => {
      apply((node) => {
        if (node.type === "text") node.content = next
        if (node.type === "component" && node.text !== undefined)
          node.text = next
      })
      return next
    },
    identity: state.selectedIds.join(","),
    selectOnFocus: false,
  })
  if (
    !nodes.length ||
    !nodes.every(
      (node) =>
        node.type === "text" ||
        (node.type === "component" && node.text !== undefined)
    )
  )
    return null
  return (
    <InspectorSection title="Texte">
      <Field className="gap-1.5">
        <FieldLabel htmlFor="node-content">Contenu</FieldLabel>
        <Textarea
          id="node-content"
          value={contentEdit.draft}
          placeholder="Valeurs mixtes"
          onFocus={contentEdit.onFocus}
          onBlur={contentEdit.onBlur}
          onKeyDown={contentEdit.onKeyDown}
          onChange={(event) => {
            contentEdit.setDraft(event.target.value)
            apply((node) => {
              if (node.type === "text") node.content = event.target.value
              if (node.type === "component" && node.text !== undefined)
                node.text = event.target.value
            })
          }}
        />
      </Field>
      {nodes.every((node) => node.type === "text") && (
        <>
          <LengthField
            label="Taille"
            resolvedValue={common((node) =>
              computedNumber(state, node, "font-size")
            )}
            tokens={lengthTokens.text}
            min={1}
            value={common((node) =>
              node.type === "text"
                ? (node.fontSize ?? node.textStyle ?? 16)
                : undefined
            )}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "text") node.fontSize = value
              })
            }
          />
          <div className="editor-field-grid grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-2">
            <InspectorSelectField
              label="Graisse"
              value={common((node) =>
                node.type === "text" ? String(node.weight ?? 400) : undefined
              )}
              options={[
                { value: "400", label: "Regular" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semibold" },
                { value: "700", label: "Bold" },
              ]}
              onChange={(value) =>
                apply((node) => {
                  if (node.type === "text")
                    node.weight = Number(value) as TextNode["weight"]
                })
              }
            />
            <InspectorSelectField
              label="Alignement"
              value={common((node) =>
                node.type === "text" ? (node.textAlign ?? "left") : undefined
              )}
              options={[
                { value: "left", label: "Gauche" },
                { value: "center", label: "Centre" },
                { value: "right", label: "Droite" },
                { value: "justify", label: "Justifié" },
              ]}
              onChange={(value) =>
                apply((node) => {
                  if (node.type === "text") node.textAlign = value
                })
              }
            />
          </div>
          <InspectorColorField
            label="Couleur du texte"
            onAlphaChange={(alpha) =>
              apply((node) => {
                if (node.type === "text")
                  node.color = withEditorAlpha(
                    node.color ?? { token: "foreground" },
                    alpha
                  )
              })
            }
            value={common((node) =>
              node.type === "text"
                ? (node.color ?? { token: "foreground" })
                : undefined
            )}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "text") node.color = value
              })
            }
          />
        </>
      )}
    </InspectorSection>
  )
}
