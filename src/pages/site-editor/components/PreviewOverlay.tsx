import type { PreviewRect } from "@/features/sites/bridge"

export type SitePreviewTarget = {
  id: string
  domTag: string
  sourceTag: string
  rect: PreviewRect
}

export function SitePreviewOverlay({
  hover,
  selection,
}: {
  hover: SitePreviewTarget | null
  selection: SitePreviewTarget | null
}) {
  const reference = selection ?? hover
  if (!reference) return null

  const viewportWidth = reference.rect.viewportWidth
  const viewportHeight = reference.rect.viewportHeight
  const sameVisibleTarget =
    hover?.id === selection?.id &&
    hover?.rect.x === selection?.rect.x &&
    hover?.rect.y === selection?.rect.y
  const visibleHover = hover && !sameVisibleTarget ? hover : null
  const labelWidth = (target: SitePreviewTarget, label: string) =>
    Math.max(
      24,
      Math.min(
        label.length * 6.5 + 12,
        target.rect.viewportWidth - Math.max(target.rect.x, 0)
      )
    )
  const labelFor = (target: SitePreviewTarget) => target.sourceTag
  const selectionLabel = selection ? labelFor(selection) : ""
  const hoverLabel = visibleHover ? labelFor(visibleHover) : ""

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
      viewBox={"0 0 " + viewportWidth + " " + viewportHeight}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {selection && (
        <>
          <rect
            x={selection.rect.x}
            y={selection.rect.y}
            width={selection.rect.width}
            height={selection.rect.height}
            className="fill-primary/10 stroke-primary stroke-[1.5]"
          />
          <rect
            x={selection.rect.x}
            y={Math.max(0, selection.rect.y - 22)}
            width={labelWidth(selection, selectionLabel)}
            height="20"
            rx="4"
            className="fill-primary"
          />
          <text
            x={selection.rect.x + 6}
            y={Math.max(0, selection.rect.y - 22) + 13}
            className="fill-primary-foreground font-mono text-[0.625rem] font-medium"
          >
            {selectionLabel}
          </text>
        </>
      )}
      {visibleHover && (
        <>
          <rect
            x={visibleHover.rect.x}
            y={visibleHover.rect.y}
            width={visibleHover.rect.width}
            height={visibleHover.rect.height}
            className="fill-violet-500/10 stroke-violet-500 stroke-[1.25]"
          />
          <rect
            x={visibleHover.rect.x}
            y={Math.max(0, visibleHover.rect.y - 20)}
            width={labelWidth(visibleHover, hoverLabel)}
            height="18"
            rx="4"
            className="fill-violet-700"
          />
          <text
            x={visibleHover.rect.x + 6}
            y={Math.max(0, visibleHover.rect.y - 20) + 12}
            className="fill-white font-mono text-[0.625rem] font-medium"
          >
            {hoverLabel}
          </text>
        </>
      )}
    </svg>
  )
}
