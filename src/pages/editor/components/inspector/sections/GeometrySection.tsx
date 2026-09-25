import { positionValue, setPositioning } from "@/features/editor/dimensions"
import { useSelection } from "@/features/editor/use-selection"
import { NumberField } from "@/components/shared/fields/NumberField"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { AlignmentControls } from "@/pages/editor/components/inspector/controls/AlignmentControls"
import { DimensionControls } from "@/pages/editor/components/inspector/controls/DimensionControls"
import { parentHasAutoLayout } from "@/features/editor/auto-layout"

export function GeometrySection() {
  const { common, apply, nodes, editor, state } = useSelection()
  const position = common((node) =>
    node.type === "frame"
      ? "absolute"
      : node.layout?.position && node.layout.position !== "flow"
        ? "absolute"
        : "flow"
  )
  const insideAutoLayout =
    nodes.length > 0 &&
    nodes.every(
      (node) => node.type !== "frame" && parentHasAutoLayout(editor, node.id)
    )
  return (
    <>
      <InspectorSection title="Position">
        <div className="editor-property-group flex flex-col gap-1">
          <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Alignement</span>
          <AlignmentControls />
        </div>
        <div className="editor-property-group flex flex-col gap-1">
          <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Position</span>
          <div className="editor-field-grid grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-2">
            {(["x", "y"] as const).map((axis) => (
              <NumberField
                key={axis}
                label={axis.toUpperCase()}
                disabled={position !== "absolute"}
                value={common((node) => positionValue(state, node, axis))}
                onChange={(value) =>
                  apply((node) => {
                    if (node.type === "frame") node[axis] = value
                    else if (
                      node.layout?.position &&
                      node.layout.position !== "flow"
                    )
                      node.layout.position[axis] = value
                  })
                }
              />
            ))}
          </div>
        </div>
        {nodes.every((node) => node.type !== "frame") && (
          <InspectorSelectField
            label={insideAutoLayout ? "Ignore auto layout" : "Placement"}
            value={position}
            options={[
              { value: "flow", label: "Dans le flux" },
              {
                value: "absolute",
                label: insideAutoLayout ? "Ignorer l’auto layout" : "Absolu",
              },
            ]}
            onChange={(value) =>
              setPositioning(editor, value === "flow" ? "flow" : "absolute")
            }
          />
        )}
      </InspectorSection>
      {!nodes.every((node) => node.type === "box" || node.type === "frame") && (
        <InspectorSection title="Layout">
          <DimensionControls />
        </InspectorSection>
      )}
    </>
  )
}
