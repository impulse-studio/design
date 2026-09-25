import { RiLayoutLeftLine, RiLayoutRightLine } from "@remixicon/react"
import { IconButton } from "@/components/shared/IconButton"
import { EditorZoomMenu } from "./EditorZoomMenu"

export function CanvasControls({
  fit,
  zoomTo,
  showZoom,
  toggleLeft,
  toggleRight,
  compact = false,
}: {
  fit: (selected?: boolean) => void
  zoomTo: (zoom: number) => void
  showZoom: boolean
  toggleLeft: () => void
  toggleRight: () => void
  compact?: boolean
}) {
  return (
    <div className="editor-canvas-controls absolute [inset:12px_12px_auto] z-[3] flex justify-between pointer-events-none [&_>_*]:pointer-events-auto [&_>_*]:bg-popover [&_>_*]:text-popover-foreground [&_>_*]:border [&_>_*]:border-border-strong [&_>_*]:rounded-lg [&_>_*]:shadow-[var(--shadow-control)]" data-canvas-control>
      <IconButton
        label="Afficher ou masquer le panneau gauche"
        className={compact ? "size-11" : undefined}
        onClick={toggleLeft}
      >
        <RiLayoutLeftLine />
      </IconButton>
      <div className="flex items-center gap-1">
        {showZoom && <EditorZoomMenu fit={fit} zoomTo={zoomTo} />}
        <IconButton
          label="Afficher ou masquer l’inspecteur"
          className={compact ? "size-11" : undefined}
          onClick={toggleRight}
        >
          <RiLayoutRightLine />
        </IconButton>
      </div>
    </div>
  )
}
