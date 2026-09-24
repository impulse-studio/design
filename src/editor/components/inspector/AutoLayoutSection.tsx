import type { AutoLayout, BoxNode, Length } from "@digit-ai-studio/shared"
import {
  RiAlignBottom,
  RiAlignLeft,
  RiAlignRight,
  RiAlignTop,
  RiAlignVertically,
  RiAlignCenter,
  RiArrowDownLine,
  RiArrowRightLine,
} from "@remixicon/react"

import { FieldLabel, PanelSection, SegmentedControl, type Option } from "@/components/studio"

import { useEditorActions } from "../../context"
import { LengthField } from "./LengthField"

const DIRECTIONS: Option<AutoLayout["direction"]>[] = [
  { value: "column", label: "Vertical", icon: <RiArrowDownLine /> },
  { value: "row", label: "Horizontal", icon: <RiArrowRightLine /> },
]

const JUSTIFY: Option<NonNullable<AutoLayout["justify"]>>[] = [
  { value: "start", label: "Début" },
  { value: "center", label: "Centre" },
  { value: "end", label: "Fin" },
  { value: "between", label: "Réparti" },
]

const alignOptions = (direction: AutoLayout["direction"]): Option<NonNullable<AutoLayout["align"]>>[] =>
  direction === "column"
    ? [
        { value: "start", label: "Gauche", icon: <RiAlignLeft /> },
        { value: "center", label: "Centre", icon: <RiAlignCenter /> },
        { value: "end", label: "Droite", icon: <RiAlignRight /> },
        { value: "stretch", label: "Étirer" },
      ]
    : [
        { value: "start", label: "Haut", icon: <RiAlignTop /> },
        { value: "center", label: "Milieu", icon: <RiAlignVertically /> },
        { value: "end", label: "Bas", icon: <RiAlignBottom /> },
        { value: "stretch", label: "Étirer" },
      ]

const PADDING_SIDES = [
  { label: "Haut", prefix: "↑" },
  { label: "Droite", prefix: "→" },
  { label: "Bas", prefix: "↓" },
  { label: "Gauche", prefix: "←" },
] as const
const ZERO: Length = 0

export function AutoLayoutSection({ node }: { node: BoxNode }) {
  const { updateNode } = useEditorActions()
  const layout = node.autoLayout
  const update = (patch: Partial<AutoLayout>) =>
    updateNode(node.id, (n) => {
      if (n.type === "box") Object.assign(n.autoLayout, patch)
    })
  const padding = layout.padding ?? [ZERO, ZERO, ZERO, ZERO]

  return (
    <PanelSection title="Auto layout">
      <SegmentedControl value={layout.direction} options={DIRECTIONS} onChange={(direction) => update({ direction })} />
      <FieldLabel>Espacement</FieldLabel>
      {layout.gap === "auto" ? (
        <SegmentedControl value="between" options={JUSTIFY} onChange={(justify) => update({ justify, gap: { token: "spacing-md" } })} />
      ) : (
        <LengthField prefix="Gap" value={layout.gap} onChange={(gap) => update({ gap })} />
      )}
      <FieldLabel>Alignement</FieldLabel>
      <SegmentedControl value={layout.justify ?? "start"} options={JUSTIFY} onChange={(justify) => update({ justify })} />
      <SegmentedControl value={layout.align ?? "stretch"} options={alignOptions(layout.direction)} onChange={(align) => update({ align })} />
      <FieldLabel>Padding</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        {PADDING_SIDES.map((side, i) => (
          <LengthField
            key={side.label}
            prefix={side.prefix}
            value={padding[i]}
            onChange={(value) => {
              const next = [...padding] as NonNullable<AutoLayout["padding"]>
              next[i] = value
              update({ padding: next })
            }}
          />
        ))}
      </div>
    </PanelSection>
  )
}
