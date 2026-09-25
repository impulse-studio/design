import { Button } from "@/components/ui/button"
import { useEditor } from "@/features/editor/context"
import { localVariantsOf } from "@/features/editor/library"
import { useSelection } from "@/features/editor/use-selection"
import { entryFor } from "@/features/editor/library"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { ComponentPropField } from "@/pages/editor/components/inspector/controls/ComponentPropField"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"

export function ComponentPropsSection() {
  const { nodes, common, apply, state } = useSelection()
  const editor = useEditor()
  const name = common((node) =>
    node.type === "component"
      ? node.component
      : node.type === "template"
        ? node.template
        : undefined
  )
  const entry = name ? entryFor(name) : undefined
  if (!entry) return null
  const componentNodes = nodes.filter((node) => node.type === "component")
  const singleComponentKind = componentNodes.length === nodes.length && !!name
  const variants = singleComponentKind
    ? localVariantsOf(state.doc, name)
    : []
  const linkedValue = common((node) =>
    node.type === "component" ? (node.localVariant?.id ?? "__linked") : undefined
  )
  return (
    <InspectorSection title={name!}>
      {singleComponentKind && (
        <>
          <InspectorSelectField
            label="Liaison Digit"
            placeholder="Sélection mixte"
            value={linkedValue}
            options={[
              { value: "__linked", label: "Instance liée" },
              ...variants.map(({ variant }) => ({
                value: variant.id,
                label: `Variante · ${variant.name}`,
              })),
            ]}
            onChange={(value) =>
              editor.assignLocalVariant(
                componentNodes.map((node) => node.id),
                value === "__linked" ? null : value
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={componentNodes.length !== 1}
              onClick={() => editor.createLocalVariant(componentNodes[0].id)}
            >
              Créer une variante locale
            </Button>
            {state.editingVariantId ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => editor.editLocalVariant(null)}
              >
                Terminer la modification
              </Button>
            ) : linkedValue && linkedValue !== "__linked" ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => editor.editLocalVariant(linkedValue)}
              >
                Modifier la variante partagée
              </Button>
            ) : null}
            <Button
              type="button"
              size="xs"
              variant="ghost"
              disabled={componentNodes.length !== 1}
              onClick={() => editor.requestDetach(componentNodes[0].id)}
            >
              Détacher cette instance
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Les variantes locales suivent leurs instances dans cette maquette et restent liées à Digi.
          </p>
        </>
      )}
      {entry.props
        .filter(
          (prop) =>
            !/^(class|id|formId)$/.test(prop.name) && !/=>/.test(prop.type)
        )
        .map((prop) => (
          <ComponentPropField
            key={`${nodes.map((node) => node.id).join(",")}:${prop.name}`}
            prop={prop}
            mixed={
              new Set(
                nodes.map((node) =>
                  JSON.stringify(
                    node.type === "component" || node.type === "template"
                      ? (node.props?.[prop.name] ?? prop.default)
                      : undefined
                  )
                )
              ).size > 1
            }
            value={common((node) =>
              node.type === "component" || node.type === "template"
                ? (node.props?.[prop.name] ?? prop.default)
                : undefined
            )}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "component" || node.type === "template")
                  node.props = { ...node.props, [prop.name]: value }
              })
            }
          />
        ))}
      {entry.slots.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Slots : {entry.slots.join(", ")}. Glissez vos calques dans l’arbre
          pour les remplir.
        </p>
      )}
    </InspectorSection>
  )
}
