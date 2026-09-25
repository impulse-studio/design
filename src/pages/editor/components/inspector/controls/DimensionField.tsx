import { dimensionValue, resizeDimension } from "@/features/editor/dimensions"
import type { SizeMode } from "@digit-ai-studio/shared"
import { useSelection } from "@/features/editor/use-selection"
import { nodeRect } from "@/features/editor/geometry"
import { parentHasAutoLayout } from "@/features/editor/auto-layout"
import { NumberField } from "@/components/shared/fields/NumberField"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const modes = [
  { value: "fixed", label: "Fixe" },
  { value: "hug", label: "Hug" },
  { value: "fill", label: "Fill" },
]

export function DimensionField({ axis }: { axis: "width" | "height" }) {
  const { common, apply, state, nodes, editor } = useSelection()
  const minimum = axis === "width" ? "minW" : "minH"
  const maximum = axis === "width" ? "maxW" : "maxH"
  const supportsFill = nodes.every(
    (node) =>
      node.type !== "frame" &&
      parentHasAutoLayout(editor, node.id) &&
      (!node.layout?.position || node.layout.position === "flow")
  )
  const supportsHug = nodes.every((node) =>
    node.type === "box"
      ? !!node.autoLayout
      : node.type === "frame"
        ? !!node.autoLayout || axis === "height"
        : true
  )
  return (
    <div className="flex min-w-0 flex-col gap-1 @min-[320px]:grid @min-[320px]:grid-cols-[minmax(0,1fr)_54px] @min-[320px]:gap-x-0.5">
      <NumberField
        label={axis === "width" ? "W" : "H"}
        min={1}
        value={common((node) => dimensionValue(state, node, axis))}
        onChange={(value) => resizeDimension(editor, axis, value)}
      />
      <InspectorSelectField
        label={
          axis === "width"
            ? "Redimensionnement en largeur"
            : "Redimensionnement en hauteur"
        }
        hideLabel
        value={common((node) =>
          node.type === "frame"
            ? node[axis] === "hug"
              ? "hug"
              : "fixed"
            : (node.layout?.[axis]?.mode ?? "hug")
        )}
        options={modes.filter(
          (mode) =>
            mode.value === "fixed" ||
            (mode.value === "hug" && supportsHug) ||
            (mode.value === "fill" && supportsFill)
        )}
        triggerClassName="bg-transparent text-muted-foreground"
        onChange={(value) =>
          apply((node) => {
            if (node.type === "frame") {
              node[axis] =
                value === "hug"
                  ? "hug"
                  : Math.max(
                      1,
                      Math.round(
                        nodeRect(state, node)?.[axis] ??
                          (axis === "width" ? 1440 : 900)
                      )
                    )
              delete node.preset
            } else
              node.layout = {
                ...node.layout,
                [axis]: {
                  mode: value as SizeMode["mode"],
                  ...(value === "fixed"
                    ? {
                        value: Math.max(
                          1,
                          Math.round(nodeRect(state, node)?.[axis] ?? 100)
                        ),
                      }
                    : {}),
                },
              }
          })
        }
      />
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="h-[18px] min-h-[18px] justify-start px-1 text-[10px] text-muted-foreground @min-[320px]:[grid-column:1/-1] pointer-coarse:!min-h-[18px]"
              aria-label={`${axis === "width" ? "Largeur" : "Hauteur"} min et max`}
            />
          }
        >
          Min / max
        </PopoverTrigger>
        <PopoverContent className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-56" align="start">
          <PopoverTitle>
            {axis === "width" ? "Limites de largeur" : "Limites de hauteur"}
          </PopoverTitle>
          <NumberField
            label={axis === "width" ? "Largeur min" : "Hauteur min"}
            min={0}
            placeholder="Min"
            value={common((node) =>
              node.type === "frame" ? node[minimum] : node.layout?.[minimum]
            )}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "frame")
                  node[minimum] = Math.min(value, node[maximum] ?? value)
                else
                  node.layout = {
                    ...node.layout,
                    [minimum]: Math.min(value, node.layout?.[maximum] ?? value),
                  }
              })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              apply((node) => {
                if (node.type === "frame") delete node[minimum]
                else if (node.layout) delete node.layout[minimum]
              })
            }
          >
            Supprimer le minimum
          </Button>
          <NumberField
            label={axis === "width" ? "Largeur max" : "Hauteur max"}
            min={0}
            placeholder="Max"
            value={common((node) =>
              node.type === "frame" ? node[maximum] : node.layout?.[maximum]
            )}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "frame")
                  node[maximum] = Math.max(value, node[minimum] ?? value)
                else
                  node.layout = {
                    ...node.layout,
                    [maximum]: Math.max(value, node.layout?.[minimum] ?? value),
                  }
              })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              apply((node) => {
                if (node.type === "frame") delete node[maximum]
                else if (node.layout) delete node.layout[maximum]
              })
            }
          >
            Supprimer le maximum
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
