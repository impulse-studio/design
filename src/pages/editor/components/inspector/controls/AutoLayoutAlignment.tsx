import { useSelection } from "@/features/editor/use-selection"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const positions = [
  { value: "start-start", label: "Haut gauche" },
  { value: "center-start", label: "Haut centre" },
  { value: "end-start", label: "Haut droite" },
  { value: "start-center", label: "Milieu gauche" },
  { value: "center-center", label: "Centre" },
  { value: "end-center", label: "Milieu droite" },
  { value: "start-end", label: "Bas gauche" },
  { value: "center-end", label: "Bas centre" },
  { value: "end-end", label: "Bas droite" },
] as const

export function AutoLayoutAlignment() {
  const { common, apply } = useSelection()
  const direction = common((node) =>
    node.type === "frame" || node.type === "box"
      ? node.autoLayout?.direction
      : undefined
  )
  const gap = common((node) =>
    node.type === "frame" || node.type === "box"
      ? node.autoLayout?.gap
      : undefined
  )
  const justify = common((node) =>
    node.type === "frame" || node.type === "box"
      ? (node.autoLayout?.justify ?? "start")
      : undefined
  )
  const align = common((node) =>
    node.type === "frame" || node.type === "box"
      ? (node.autoLayout?.align ?? "stretch")
      : undefined
  )
  const auto = gap === "auto"
  const x = direction === "column" ? align : justify
  const y = direction === "column" ? justify : align
  const value =
    x &&
    y &&
    ["start", "center", "end"].includes(x) &&
    ["start", "center", "end"].includes(y)
      ? `${x}-${y}`
      : undefined
  return (
    <div className="editor-property-group flex flex-col gap-1">
      <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Alignement</span>
      <ToggleGroup
        value={value ? [value] : []}
        onValueChange={(values) => {
          const next = values[0]
          if (!next) return
          const [horizontal, vertical] = next.split("-") as [
            "start" | "center" | "end",
            "start" | "center" | "end",
          ]
          apply((node) => {
            if (
              (node.type !== "frame" && node.type !== "box") ||
              !node.autoLayout
            )
              return
            if (node.autoLayout.direction === "column") {
              node.autoLayout.align = horizontal
              if (node.autoLayout.gap !== "auto")
                node.autoLayout.justify = vertical
            } else {
              if (node.autoLayout.gap !== "auto")
                node.autoLayout.justify = horizontal
              node.autoLayout.align = vertical
            }
          })
        }}
        spacing={0}
        className="editor-layout-alignment [&_[data-state=on]]:[color:var(--editor-selection)] [&_[data-state=on]]:bg-background [&_[data-state=on]]:shadow-[0_1px_3px_#0000001a] grid grid-cols-[repeat(3,_minmax(0,_1fr))] grid-rows-[repeat(3,_minmax(0,_1fr))] w-full h-[84px] p-1 rounded-md bg-muted [&_[data-slot=toggle-group-item]]:grid [&_[data-slot=toggle-group-item]]:place-items-center [&_[data-slot=toggle-group-item]]:min-w-0 [&_[data-slot=toggle-group-item]]:min-h-0 [&_[data-slot=toggle-group-item]]:[padding:0] [&_[data-slot=toggle-group-item]]:rounded-sm [&_[data-state=on]_.editor-layout-alignment-dot]:w-[10px] [&_[data-state=on]_.editor-layout-alignment-dot]:h-[3px] [&_[data-state=on]_.editor-layout-alignment-dot]:rounded-[2px] [@media(hover:hover)_and_(pointer:fine)]:[&_[data-slot=toggle-group-item]:not([data-state=on]):hover]:bg-accent"
        aria-label="Alignement auto layout"
      >
        {positions.map(({ value: position, label }) => {
          const [horizontal, vertical] = position.split("-")
          const disabled =
            auto &&
            (direction === "column"
              ? vertical !== "start"
              : horizontal !== "start")
          return (
            <ToggleGroupItem
              key={position}
              value={position}
              aria-label={label}
              disabled={disabled}
              title={label}
            >
              <span
                aria-hidden="true"
                className="editor-layout-alignment-dot w-[3px] h-[3px] rounded-full bg-current"
              />
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}
