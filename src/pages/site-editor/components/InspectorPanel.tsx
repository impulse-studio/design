import { sourceElementName } from "@/features/sites/element-name"
import { OptionSelect } from "@/components/shared/OptionSelect"
import type { PreviewInventoryEntry } from "@/features/sites/bridge"
import type {
  Breakpoint,
  SiteChange,
  SiteDocument,
} from "@/features/sites/schema"
import type { SiteElementStatus, SourceElement } from "@/features/sites/source"
import type { SiteMode } from "./Toolbar"
import { SiteDevInspector } from "./DevInspector"
import { SiteInspector } from "./Inspector"

const inspectorTitles: Record<SiteMode, string> = {
  dev: "Inspecteur Dev",
  edit: "Ajuster le site",
  navigation: "Versions du projet",
}

export function SiteEditorInspectorPanel({
  mode,
  elements,
  renderedElements,
  element,
  domTag,
  count,
  elementStatus,
  statusById,
  selection,
  breakpoint,
  revision,
  doc,
  busy,
  canEdit,
  onSelectElement,
  onOpenFile,
  onEdit,
  onSelectionChange,
}: {
  mode: SiteMode
  elements: SourceElement[]
  renderedElements: PreviewInventoryEntry[]
  element: SourceElement | null
  domTag: string | null
  count: number
  elementStatus: SiteElementStatus | null
  statusById: Map<string, SiteElementStatus>
  selection: string | null
  breakpoint: Breakpoint
  revision: number
  doc: SiteDocument
  busy: boolean
  canEdit: boolean
  onSelectElement: (id: string) => void
  onOpenFile: (path: string, line: number | null) => void
  onEdit: (
    change: Extract<SiteChange, { type: "visual" | "text" }>
  ) => Promise<void>
  onSelectionChange: (id: string | null) => void
}) {
  return (
    <aside className="site-editor-inspector w-[280px] shrink-0 border-l border-border overflow-auto max-[1100px]:w-[240px]">
      <div className="site-panel-heading py-[18px] px-4 border-b border-border [&_h2]:text-[13px] [&_h2]:font-semibold [&_p]:text-[11px] [&_p]:text-muted-foreground [&_p]:mt-1">
        <h2>{inspectorTitles[mode]}</h2>
      </div>
      {mode === "dev" && (
        <SiteDevInspector
          elements={elements}
          renderedElements={renderedElements}
          element={element}
          domTag={domTag}
          count={count}
          status={elementStatus}
          statusById={statusById}
          onSelect={onSelectElement}
          onOpenFile={onOpenFile}
        />
      )}
      {mode === "edit" && (
        <>
          <div className="p-4">
            <OptionSelect
              label="Élément"
              value={selection ?? ""}
              onValueChange={onSelectionChange}
              placeholder="Sélectionner un élément…"
              options={elements.map((item) => ({
                value: item.id,
                label: `${sourceElementName(item)} · ${item.text?.slice(0, 35) || item.file.split("/").at(-1)}`,
              }))}
            />
          </div>
          <SiteInspector
            key={`${selection}:${breakpoint}:${revision}`}
            element={element}
            count={count}
            doc={doc}
            breakpoint={breakpoint}
            busy={busy}
            canEdit={canEdit}
            onEdit={onEdit}
          />
        </>
      )}
    </aside>
  )
}
