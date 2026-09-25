import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiGridLine,
  RiLayoutGridLine,
} from "@remixicon/react"
import type { AutoLayout } from "@digit-ai-studio/shared"
import {
  addAutoLayoutToSelection,
  setAutoLayout,
} from "@/features/editor/auto-layout"
import { useSelection } from "@/features/editor/use-selection"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const flows = [
  { value: "free", label: "Libre", icon: RiLayoutGridLine },
  { value: "column", label: "Vertical", icon: RiArrowDownLine },
  { value: "row", label: "Horizontal", icon: RiArrowRightLine },
  { value: "grid", label: "Grille", icon: RiGridLine },
] as const

export function AutoLayoutFlowControls() {
  const { common, editor, nodes } = useSelection()
  const value =
    nodes.length === 1 && (nodes[0].type === "frame" || nodes[0].type === "box")
      ? common((node) =>
          node.type === "frame" || node.type === "box"
            ? (node.autoLayout?.direction ?? "free")
            : undefined
        )
      : undefined
  return (
    <div className="editor-property-group flex flex-col gap-1">
      <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Flux</span>
      <ToggleGroup
        value={value ? [value] : []}
        onValueChange={(values) => {
          const next = values[0] as AutoLayout["direction"] | "free" | undefined
          if (!next) return
          if (next === "free") {
            if (nodes.length === 1) setAutoLayout(editor, null)
          } else addAutoLayoutToSelection(editor, next)
        }}
        spacing={0}
        className="editor-layout-flow flex w-full h-[32px] rounded-md bg-muted [&_[data-slot=toggle-group-item]]:flex-1 [&_[data-slot=toggle-group-item]]:min-w-0 [&_[data-slot=toggle-group-item]]:h-[32px] [&_[data-slot=toggle-group-item]]:[padding:0] [&_[data-slot=toggle-group-item]]:rounded-[5px] [&_[data-slot=toggle-group-item]_svg]:w-[16px] [&_[data-slot=toggle-group-item]_svg]:h-[16px] [&_[data-state=on]]:[color:var(--editor-selection)] [&_[data-state=on]]:bg-background [&_[data-state=on]]:shadow-[0_1px_3px_#0000001a] [@media(hover:hover)_and_(pointer:fine)]:[&_[data-slot=toggle-group-item]:not([data-state=on]):hover]:bg-accent"
        aria-label="Flux auto layout"
      >
        {flows.map(({ value: flow, label, icon: Icon }) => (
          <ToggleGroupItem
            key={flow}
            value={flow}
            aria-label={label}
            title={label}
            disabled={
              flow === "free" &&
              (nodes.length !== 1 ||
                (nodes[0].type !== "frame" && nodes[0].type !== "box"))
            }
          >
            <Icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
