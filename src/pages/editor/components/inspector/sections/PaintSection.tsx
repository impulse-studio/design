import {
  RiAddLine,
  RiSubtractLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react"
import { findNode } from "@digit-ai-studio/shared"
import { useSelection } from "@/features/editor/use-selection"
import { framesOf } from "@/features/editor/document"
import { parseColor, toHex } from "@/lib/colors"
import { resolveEditorColor, withEditorAlpha } from "@/features/editor/colors"
import type { Color } from "@digit-ai-studio/shared"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { IconButton } from "@/components/shared/IconButton"
import { InspectorColorField } from "@/pages/editor/components/inspector/InspectorColorField"
import { NumberField } from "@/components/shared/fields/NumberField"

export function PaintSection({ kind }: { kind: "fill" | "border" }) {
  const { nodes, common, apply, state } = useSelection(),
    fill = kind === "fill"
  const visible = common((node) =>
    fill
      ? node.style?.backgroundVisible !== false
      : node.style?.border?.visible !== false
  )
  const paint = (node: (typeof nodes)[number]) => {
    const explicit = fill ? node.style?.background : node.style?.border?.color
    if (explicit !== undefined) return explicit
    const frame = findNode(framesOf(state.doc), node.id)?.frame
    const css = frame
      ? state.layouts[frame.id]?.computed?.[node.id]?.[
          fill ? "background-color" : "border-color"
        ]
      : undefined
    const inherited = css ? parseColor(css) : null
    return inherited
      ? toHex(inherited)
      : node.type === "frame"
        ? "#FFFFFF"
        : "#00000000"
  }
  const ownsPaint = (node: (typeof nodes)[number]) =>
    fill
      ? node.style?.background !== undefined ||
        (node.style?.backgroundVisible !== false &&
          resolveEditorColor(paint(node)).a > 0)
      : !!node.style?.border &&
        (node.style.border.visible !== false || node.style.border.width > 0)
  const hasPaint = nodes.some(ownsPaint)
  const allPaint = nodes.every(ownsPaint)
  const removePaint = () =>
    apply((node) => {
      node.style ??= {}
      if (fill) {
        delete node.style.background
        node.style.backgroundVisible = false
      } else {
        node.style.border = { color: "#000000", width: 0, visible: false }
      }
    })
  const current = common(paint)
  const setPaint = (colorFor: (node: (typeof nodes)[number]) => Color) =>
    apply((node) => {
      const color = colorFor(node)
      node.style ??= {}
      if (fill) {
        node.style.background = color
        node.style.backgroundVisible = true
      } else
        node.style.border = {
          ...node.style.border,
          width: node.style.border?.width ?? 1,
          color,
        }
    })
  return (
    <InspectorSection
      title={fill ? "Fond" : "Bordure"}
      actions={
        <IconButton
          label={`Ajouter ${fill ? "un fond" : "une bordure"}`}
          disabled={allPaint}
          onClick={() =>
            apply((node) => {
              if (ownsPaint(node)) return
              node.style ??= {}
              if (fill) {
                node.style.background = "#FFFFFF"
                node.style.backgroundVisible = true
              } else
                node.style.border = { color: { token: "border" }, width: 1 }
            })
          }
        >
          <RiAddLine />
        </IconButton>
      }
    >
      {hasPaint && (
        <>
          <div className="flex items-end gap-1">
            <div className="min-w-0 flex-1">
              <InspectorColorField
                hideLabel
                label={fill ? "Couleur de fond" : "Couleur de bordure"}
                value={current}
                opacityValue={common(
                  (node) => resolveEditorColor(paint(node)).a
                )}
                onChange={(color) => setPaint(() => color)}
                onAlphaChange={(alpha) =>
                  setPaint((node) => withEditorAlpha(paint(node), alpha))
                }
              />
            </div>
            <IconButton
              label={
                visible
                  ? `Masquer ${fill ? "le fond" : "la bordure"}`
                  : `Afficher ${fill ? "le fond" : "la bordure"}`
              }
              onClick={() =>
                apply((node) => {
                  node.style ??= {}
                  if (fill) {
                    node.style.background ??= paint(node)
                    node.style.backgroundVisible = !visible
                  } else if (node.style.border)
                    node.style.border.visible = !visible
                })
              }
            >
              {visible ? <RiEyeLine /> : <RiEyeOffLine />}
            </IconButton>
            <IconButton
              label={`Supprimer ${fill ? "le fond" : "la bordure"}`}
              onClick={removePaint}
            >
              <RiSubtractLine />
            </IconButton>
          </div>
          {!fill && (
            <NumberField
              label="Épaisseur"
              min={0}
              value={common((node) => node.style?.border?.width ?? 0)}
              onChange={(width) =>
                apply((node) => {
                  node.style ??= {}
                  node.style.border = {
                    ...node.style.border,
                    color: node.style.border?.color ?? { token: "border" },
                    width,
                  }
                })
              }
            />
          )}
        </>
      )}
    </InspectorSection>
  )
}
