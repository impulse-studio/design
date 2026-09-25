import { useSelection } from "@/features/editor/use-selection"
import { DimensionControls } from "@/pages/editor/components/inspector/controls/DimensionControls"
import { AutoLayoutFlowControls } from "@/pages/editor/components/inspector/controls/AutoLayoutFlowControls"
import { AutoLayoutAlignment } from "@/pages/editor/components/inspector/controls/AutoLayoutAlignment"
import { AutoLayoutGapControls } from "@/pages/editor/components/inspector/controls/AutoLayoutGapControls"
import { AutoLayoutPaddingControls } from "@/pages/editor/components/inspector/controls/AutoLayoutPaddingControls"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel } from "@/components/ui/field"

export function LayoutSection() {
  const { nodes, common, apply } = useSelection()
  if (!nodes.length) return null
  const singleContainer =
    nodes.length === 1 && (nodes[0].type === "frame" || nodes[0].type === "box")
  if (!singleContainer)
    return (
      <InspectorSection title="Auto layout">
        <p className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">
          Choisissez un flux pour placer la sélection dans une frame auto
          layout.
        </p>
        <AutoLayoutFlowControls />
      </InspectorSection>
    )
  const active = nodes.every(
    (node) =>
      (node.type === "frame" || node.type === "box") && !!node.autoLayout
  )
  const direction = common((node) =>
    node.type === "frame" || node.type === "box"
      ? node.autoLayout?.direction
      : undefined
  )
  return (
    <InspectorSection title="Auto layout">
      <AutoLayoutFlowControls />
      <DimensionControls label={active ? "Redimensionnement" : "Dimensions"} />
      {active && (
        <>
          {direction === "row" && (
            <Field orientation="horizontal">
              <FieldLabel htmlFor="layout-wrap">Retour à la ligne</FieldLabel>
              <Switch
                id="layout-wrap"
                checked={
                  common((node) =>
                    node.type === "frame" || node.type === "box"
                      ? !!node.autoLayout?.wrap
                      : false
                  ) ?? false
                }
                onCheckedChange={(value) =>
                  apply((node) => {
                    if (
                      (node.type === "frame" || node.type === "box") &&
                      node.autoLayout
                    )
                      node.autoLayout.wrap = value
                  })
                }
              />
            </Field>
          )}
          <div className="editor-layout-detail-grid grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] gap-2 items-start [&_.editor-field-grid]:grid-cols-[minmax(0,_1fr)] [&_.editor-field-grid]:gap-1">
            <AutoLayoutAlignment />
            <AutoLayoutGapControls />
          </div>
          <AutoLayoutPaddingControls />
          <Field orientation="horizontal">
            <FieldLabel htmlFor="clip-layout">Clip content</FieldLabel>
            <Switch
              id="clip-layout"
              checked={
                common((node) =>
                  node.type === "frame"
                    ? node.clip !== false
                    : node.type === "box"
                      ? !!node.clip
                      : false
                ) ?? false
              }
              onCheckedChange={(value) =>
                apply((node) => {
                  if (node.type === "frame" || node.type === "box")
                    node.clip = value
                })
              }
            />
          </Field>
        </>
      )}
    </InspectorSection>
  )
}
