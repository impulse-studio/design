import type { Node, SizeMode } from "@digit-ai-studio/shared"

import { FieldLabel, NumberField, PanelSection, SegmentedControl, type Option } from "@/components/studio"

import { useEditorActions } from "../../context"

const MODES: Option<SizeMode["mode"]>[] = [
  { value: "fixed", label: "Fixe" },
  { value: "hug", label: "Hug" },
  { value: "fill", label: "Fill" },
]

function AxisField({
  label,
  size,
  measured,
  onChange,
}: {
  label: "W" | "H"
  size: SizeMode | undefined
  measured: number | undefined
  onChange: (size: SizeMode) => void
}) {
  const mode = size?.mode ?? "hug"
  return (
    <div className="flex flex-col gap-1">
      <NumberField
        prefix={label}
        value={mode === "fixed" ? size?.value : measured === undefined ? undefined : Math.round(measured)}
        min={0}
        disabled={mode !== "fixed"}
        onCommit={(value) => onChange({ mode: "fixed", value })}
      />
      <SegmentedControl value={mode} options={MODES} onChange={(m) => onChange({ mode: m, value: m === "fixed" ? Math.round(measured ?? 0) : undefined })} />
    </div>
  )
}

/** Figma's resizing: fixed size, hug contents or fill the parent. */
export function SizeSection({ node, measured }: { node: Node; measured?: { width: number; height: number } }) {
  const { updateNode } = useEditorActions()
  const update = (axis: "width" | "height", size: SizeMode) =>
    updateNode(node.id, (n) => {
      if (n.type === "frame") return
      n.layout = { ...n.layout, [axis]: size }
    })

  return (
    <PanelSection title="Taille">
      <div className="grid grid-cols-2 gap-2">
        <AxisField label="W" size={node.layout?.width} measured={measured?.width} onChange={(s) => update("width", s)} />
        <AxisField label="H" size={node.layout?.height} measured={measured?.height} onChange={(s) => update("height", s)} />
      </div>
      <FieldLabel>Hug = taille du contenu · Fill = remplit le parent</FieldLabel>
    </PanelSection>
  )
}
