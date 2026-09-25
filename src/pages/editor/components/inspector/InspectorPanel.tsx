import { RiCodeSSlashLine } from "@remixicon/react"
import { useSelection } from "@/features/editor/use-selection"
import { GeometrySection } from "./sections/GeometrySection"
import { LayoutSection } from "./sections/LayoutSection"
import { TextSection } from "./sections/TextSection"
import { AppearanceSection } from "./sections/AppearanceSection"
import { ComponentPropsSection } from "./sections/ComponentPropsSection"
import { ElementSection } from "./sections/ElementSection"
import { InspectSelectionSummary } from "./inspect/InspectSelectionSummary"
import { InspectPanel } from "./inspect/InspectPanel"
import { InspectorSelectionHeader } from "./InspectorSelectionHeader"
import { InspectorPageSection } from "./sections/InspectorPageSection"
import { InspectorExportSection } from "./sections/InspectorExportSection"
import { EditorZoomMenu } from "@/pages/editor/components/canvas/EditorZoomMenu"

export function InspectorPanel({
  fit,
  zoomTo,
}: {
  fit: (selected?: boolean) => void
  zoomTo: (zoom: number) => void
}) {
  const { nodes, state, disabled } = useSelection()
  const inspect = state.rightTab === "inspect"
  return (
    <div
      className="editor-inspector flex flex-col flex-1 min-h-0 gap-[0] [container-type:inline-size] [&_.editor-number-field]:h-[24px] [&_.editor-number-field]:gap-1.5 [&_.editor-number-field]:pl-2 [&_.editor-number-field]:border [&_.editor-number-field]:border-transparent [&_.editor-number-field]:rounded-[5px] [&_.editor-number-field]:bg-muted [&_.editor-number-field:focus-within]:[border-color:var(--editor-selection)] [&_.editor-number-field_>_.editor-scrub-label]:static [&_.editor-number-field_>_.editor-scrub-label]:max-w-[none] [&_.editor-number-field_>_.editor-scrub-label]:shrink-0 [&_.editor-number-field_>_.editor-scrub-label]:text-[11px] [&_.editor-number-field_>_.editor-scrub-label]:leading-[22px] [&_.editor-number-field_>_.editor-scrub-label]:text-muted-foreground [&_.editor-number-field_>_.editor-scrub-label]:overflow-visible [&_.editor-number-field_>_input]:h-[22px] [&_.editor-number-field_>_input]:min-w-0 [&_.editor-number-field_>_input]:w-full [&_.editor-number-field_>_input]:[padding:0_4px_0_0] [&_.editor-number-field_>_input]:border-0 [&_.editor-number-field_>_input]:rounded-none [&_.editor-number-field_>_input]:bg-transparent [&_.editor-number-field_>_input]:shadow-none [&_.editor-number-field_>_input]:text-left [&_.editor-number-field_>_input]:text-[11px] [&_.editor-number-field_>_input]:[outline:0] [&_.editor-number-field_>_input]:[appearance:textfield] [&_.editor-number-field_>_input::-webkit-inner-spin-button]:appearance-none [&_.editor-number-field[data-disabled]]:opacity-[0.5] [&_.editor-length-field]:rounded-[5px] [&_.editor-length-field]:bg-muted [&_.editor-length-field_>_button]:w-[20px] [&_.editor-length-field_>_button]:h-[24px] [&_.editor-color-row]:h-[24px] [&_.editor-color-row]:[padding:0_3px] [&_.editor-color-row]:gap-0.5 [&_.editor-color-row_>_button]:h-[22px] [&_.editor-color-row_>_button]:w-[20px] [&_.editor-color-row_.editor-color-code]:h-[22px] [&_.editor-color-opacity_input]:h-[22px] [&_.editor-color-opacity]:w-[52px] [&_.editor-swatch]:w-[14px] [&_.editor-swatch]:h-[14px] [&_.editor-swatch]:rounded-[2px] [&[data-mode=inspect]_.editor-box-model]:[border-color:var(--editor-dev)] [&[data-mode=inspect]_.editor-box-model]:[background:color-mix(in_srgb,_var(--editor-dev),_transparent_92%)] [&_.editor-scrub-label_svg]:w-[14px] [&_.editor-scrub-label_svg]:h-[14px] [&_.editor-scrub-label]:whitespace-nowrap [&_.editor-number-field:has(input:disabled)]:opacity-[0.5]"
      data-mode={inspect ? "inspect" : "design"}
    >
      <div className="editor-inspector-mode-row h-[32px] shrink-0 flex items-center justify-between [padding:0_8px_8px] border-b border-border">
        <span className="editor-panel-mode inline-flex items-center gap-1.5 h-[24px] rounded-md bg-muted [padding:0_8px] text-[11px] font-medium [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:[color:var(--editor-dev)]">
          {inspect && <RiCodeSSlashLine />}
          {inspect ? "Dev Mode" : "Design"}
        </span>
        <EditorZoomMenu fit={fit} zoomTo={zoomTo} />
      </div>
      {inspect ? (
        nodes.length > 1 ? (
          <InspectSelectionSummary />
        ) : (
          <InspectPanel key={nodes[0]?.id} />
        )
      ) : (
        <div className="editor-inspector-scroll flex-1 min-h-0 h-full overflow-auto [scrollbar-width:thin] pb-7 [&_>_.editor-inspector-section:first-of-type]:border-t-0 [&_>_[data-slot=separator]:first-child]:hidden">
          {nodes.length === 0 ? (
            <InspectorPageSection />
          ) : (
            <>
              <InspectorSelectionHeader />
              <fieldset
                key={state.selectedIds.join(",")}
                disabled={disabled}
                className="editor-inspector-fields border-0 [margin:0] [padding:0] min-w-0 [&:disabled]:opacity-[0.55] [&:disabled]:pointer-events-none"
              >
                <GeometrySection />
                <LayoutSection />
                <ComponentPropsSection />
                <ElementSection />
                <TextSection />
                <AppearanceSection />
              </fieldset>
              <InspectorExportSection />
            </>
          )}
        </div>
      )}
    </div>
  )
}
