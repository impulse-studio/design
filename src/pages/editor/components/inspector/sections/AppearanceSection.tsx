import { RiContrastDrop2Line, RiRoundedCorner } from "@remixicon/react"
import { computedNumber } from "@/features/editor/geometry"
import { useSelection } from "@/features/editor/use-selection"
import { PaintSection } from "./PaintSection"
import { LengthField } from "@/components/shared/fields/LengthField"
import { lengthTokens } from "@/features/editor/tokens"
import { NumberField } from "@/components/shared/fields/NumberField"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function AppearanceSection() {
  const { common, apply, nodes, state } = useSelection()
  return (
    <>
      <InspectorSection title="Apparence">
        {nodes.every((node) => node.type === "frame") && (
          <InspectorSelectField
            label="Thème de la frame"
            value={common((node) =>
              node.type === "frame" ? (node.theme ?? "light") : "light"
            )}
            options={[
              { value: "light", label: "Clair" },
              { value: "dark", label: "Sombre" },
            ]}
            onChange={(value) =>
              apply((node) => {
                if (node.type === "frame")
                  node.theme = value === "dark" ? "dark" : "light"
              })
            }
          />
        )}
        <div className="editor-field-grid grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-2">
          <div className="editor-property-group flex flex-col gap-1">
            <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Opacité</span>
            <NumberField
              prefix={<RiContrastDrop2Line />}
              label="Opacité %"
              min={0}
              max={100}
              value={common((node) => (node.style?.opacity ?? 1) * 100)}
              onChange={(value) =>
                apply((node) => {
                  node.style = { ...node.style, opacity: value / 100 }
                })
              }
            />
          </div>
          <div className="editor-property-group flex flex-col gap-1">
            <span className="editor-control-label text-[11px] font-normal leading-[16px] text-muted-foreground">Rayon des angles</span>
            <LengthField
              tokens={lengthTokens.radius}
              prefix={<RiRoundedCorner />}
              label="Rayon"
              resolvedValue={common((node) =>
                computedNumber(state, node, "border-radius")
              )}
              value={common((node) => node.style?.radius ?? 0)}
              onChange={(radius) =>
                apply((node) => {
                  node.style = { ...node.style, radius }
                })
              }
            />
          </div>
        </div>
        {nodes.every((node) => node.type === "frame" && !node.autoLayout) && (
          <Field orientation="horizontal">
            <FieldLabel htmlFor="clip-frame">Masquer le débordement</FieldLabel>
            <Switch
              id="clip-frame"
              checked={
                common((node) =>
                  node.type === "frame" ? node.clip !== false : true
                ) ?? false
              }
              onCheckedChange={(value) =>
                apply((node) => {
                  if (node.type === "frame") node.clip = value
                })
              }
            />
          </Field>
        )}
      </InspectorSection>
      <PaintSection kind="fill" />
      <PaintSection kind="border" />
      <InspectorSection title="Effets">
        <InspectorSelectField
          label="Ombre"
          value={common((node) =>
            typeof node.style?.shadow === "string" ? node.style.shadow : "none"
          )}
          options={[
            { value: "none", label: "Aucune" },
            { value: "0px 2px 8px #0000001a", label: "Légère" },
            { value: "0px 8px 24px #00000026", label: "Élevée" },
          ]}
          onChange={(shadow) =>
            apply((node) => {
              node.style = { ...node.style, shadow }
            })
          }
        />
      </InspectorSection>
    </>
  )
}
