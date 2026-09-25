import { useState } from "react"
import type { Length } from "@digit-ai-studio/shared"
import { RiLink, RiLinkUnlink } from "@remixicon/react"
import { computedNumber } from "@/features/editor/geometry"
import { useSelection } from "@/features/editor/use-selection"
import { lengthTokens } from "@/features/editor/tokens"
import { LengthField } from "@/components/shared/fields/LengthField"
import { IconButton } from "@/components/shared/IconButton"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"

type PaddingMode = "all" | "axes" | "sides"

export function AutoLayoutPaddingControls() {
  const { nodes, common, apply, state } = useSelection()
  const [override, setOverride] = useState<PaddingMode | null>(null)
  const padding = common((node) =>
    node.type === "frame" || node.type === "box"
      ? (node.autoLayout?.padding ?? [0, 0, 0, 0])
      : undefined
  )
  const equal = nodes.every((node) => {
    if ((node.type !== "frame" && node.type !== "box") || !node.autoLayout)
      return false
    const values = node.autoLayout.padding ?? [0, 0, 0, 0]
    return values.every(
      (value) => JSON.stringify(value) === JSON.stringify(values[0])
    )
  })
  const axes =
    padding &&
    JSON.stringify(padding[0]) === JSON.stringify(padding[2]) &&
    JSON.stringify(padding[1]) === JSON.stringify(padding[3])
  const mode = override ?? (equal ? "all" : axes ? "axes" : "sides")
  const fields =
    mode === "all"
      ? [{ label: "Padding", indices: [0, 1, 2, 3] }]
      : mode === "axes"
        ? [
            { label: "Vertical", indices: [0, 2] },
            { label: "Horizontal", indices: [1, 3] },
          ]
        : [
            { label: "Haut", indices: [0] },
            { label: "Droite", indices: [1] },
            { label: "Bas", indices: [2] },
            { label: "Gauche", indices: [3] },
          ]
  return (
    <div className="editor-property-group flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Padding</span>
        <IconButton
          label={
            mode === "all" ? "Dissocier les paddings" : "Lier les paddings"
          }
          active={mode === "all"}
          onClick={() => setOverride(mode === "all" ? "sides" : "all")}
        >
          {mode === "all" ? <RiLink /> : <RiLinkUnlink />}
        </IconButton>
      </div>
      <InspectorSelectField
        label="Mode de padding"
        value={mode}
        options={[
          { value: "all", label: "Uniforme" },
          { value: "axes", label: "Horizontal et vertical" },
          { value: "sides", label: "Quatre côtés" },
        ]}
        onChange={setOverride}
      />
      <div className="editor-field-grid grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-2">
        {fields.map(({ label, indices }) => (
          <LengthField
            key={label}
            tokens={lengthTokens.spacing}
            label={label}
            resolvedValue={common((node) =>
              computedNumber(
                state,
                node,
                [
                  "padding-top",
                  "padding-right",
                  "padding-bottom",
                  "padding-left",
                ][indices[0]]
              )
            )}
            value={common((node) => {
              if (
                (node.type !== "frame" && node.type !== "box") ||
                !node.autoLayout
              )
                return undefined
              const values = node.autoLayout.padding ?? [0, 0, 0, 0]
              return indices.every(
                (index) =>
                  JSON.stringify(values[index]) ===
                  JSON.stringify(values[indices[0]])
              )
                ? values[indices[0]]
                : undefined
            })}
            onChange={(value) =>
              apply((node) => {
                if (
                  (node.type !== "frame" && node.type !== "box") ||
                  !node.autoLayout
                )
                  return
                const values = [
                  ...(node.autoLayout.padding ?? [0, 0, 0, 0]),
                ] as [Length, Length, Length, Length]
                for (const index of indices) values[index] = value
                node.autoLayout.padding = values
              })
            }
          />
        ))}
      </div>
    </div>
  )
}
