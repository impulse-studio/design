import { RiLink, RiLinkUnlink } from "@remixicon/react"
import { useSelection } from "@/features/editor/use-selection"
import { DimensionField } from "./DimensionField"
import { IconButton } from "@/components/shared/IconButton"

export function DimensionControls({
  label = "Dimensions",
}: {
  label?: string
}) {
  const { common, apply } = useSelection()
  const locked = common((node) => !!node.lockAspectRatio) === true
  return (
    <div className="editor-property-group flex flex-col gap-1">
      <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">{label}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_20px] items-start gap-1.5">
        <DimensionField axis="width" />
        <DimensionField axis="height" />
        <IconButton
          className="h-6 min-h-6 w-5 p-0.5 pointer-coarse:!min-h-6"
          label={
            locked
              ? "Déverrouiller les proportions"
              : "Verrouiller les proportions"
          }
          active={locked}
          onClick={() =>
            apply((node) => {
              node.lockAspectRatio = !locked
            })
          }
        >
          {locked ? <RiLink /> : <RiLinkUnlink />}
        </IconButton>
      </div>
    </div>
  )
}
