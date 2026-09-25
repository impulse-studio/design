import { computedNumber } from "@/features/editor/geometry"
import { useSelection } from "@/features/editor/use-selection"
import { lengthTokens } from "@/features/editor/tokens"
import { LengthField } from "@/components/shared/fields/LengthField"
import { NumberField } from "@/components/shared/fields/NumberField"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"

export function AutoLayoutGapControls() {
  const { nodes, common, apply, state } = useSelection()
  const direction = common((node) =>
    node.type === "frame" || node.type === "box"
      ? node.autoLayout?.direction
      : undefined
  )
  const wrapped =
    direction === "row" &&
    nodes.every(
      (node) =>
        (node.type === "frame" || node.type === "box") &&
        !!node.autoLayout?.wrap
    )
  const grid = direction === "grid"
  const auto = nodes.every(
    (node) =>
      (node.type === "frame" || node.type === "box") &&
      node.autoLayout?.gap === "auto"
  )
  return (
    <div className="editor-property-group flex flex-col gap-1">
      <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Gap</span>
      <div className="editor-field-grid grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-2">
        <LengthField
          tokens={lengthTokens.spacing}
          label={grid || wrapped ? "Gap horizontal" : "Gap"}
          resolvedValue={common((node) => computedNumber(state, node, "gap"))}
          placeholder={auto ? "Auto" : "Mixte"}
          value={common((node) =>
            (node.type === "frame" || node.type === "box") &&
            node.autoLayout?.gap !== "auto"
              ? (node.autoLayout?.gap ?? 0)
              : undefined
          )}
          onChange={(gap) =>
            apply((node) => {
              if (
                (node.type !== "frame" && node.type !== "box") ||
                !node.autoLayout
              )
                return
              node.autoLayout.gap = gap
              if (
                ["between", "around", "evenly"].includes(
                  node.autoLayout.justify ?? ""
                )
              )
                node.autoLayout.justify = "start"
            })
          }
        />
        {grid ? (
          <NumberField
            label="Colonnes"
            min={1}
            max={100}
            value={common((node) =>
              node.type === "frame" || node.type === "box"
                ? (node.autoLayout?.gridColumns ?? 2)
                : undefined
            )}
            onChange={(value) =>
              apply((node) => {
                if (
                  (node.type === "frame" || node.type === "box") &&
                  node.autoLayout
                )
                  node.autoLayout.gridColumns = Math.max(
                    1,
                    Math.min(100, Math.round(value))
                  )
              })
            }
          />
        ) : (
          <InspectorSelectField
            label="Mode du gap"
            value={auto ? "auto" : "fixed"}
            options={[
              { value: "fixed", label: "Fixe" },
              { value: "auto", label: "Auto" },
            ]}
            onChange={(mode) =>
              apply((node) => {
                if (
                  (node.type !== "frame" && node.type !== "box") ||
                  !node.autoLayout
                )
                  return
                node.autoLayout.gap = mode === "auto" ? "auto" : 0
                node.autoLayout.justify = mode === "auto" ? "between" : "start"
              })
            }
          />
        )}
      </div>
      {(grid || wrapped) && (
        <LengthField
          tokens={lengthTokens.spacing}
          label="Gap vertical"
          resolvedValue={common((node) =>
            computedNumber(state, node, "row-gap")
          )}
          value={common((node) =>
            node.type === "frame" || node.type === "box"
              ? (node.autoLayout?.crossGap ?? 0)
              : undefined
          )}
          onChange={(gap) =>
            apply((node) => {
              if (
                (node.type === "frame" || node.type === "box") &&
                node.autoLayout
              )
                node.autoLayout.crossGap = gap
            })
          }
        />
      )}
      {auto && !grid && (
        <InspectorSelectField
          label="Répartition automatique"
          value={common((node) =>
            node.type === "frame" || node.type === "box"
              ? (node.autoLayout?.justify ?? "between")
              : undefined
          )}
          options={[
            { value: "between", label: "Between" },
            { value: "around", label: "Around" },
            { value: "evenly", label: "Evenly" },
          ]}
          onChange={(justify) =>
            apply((node) => {
              if (
                (node.type === "frame" || node.type === "box") &&
                node.autoLayout
              )
                node.autoLayout.justify = justify
            })
          }
        />
      )}
    </div>
  )
}
