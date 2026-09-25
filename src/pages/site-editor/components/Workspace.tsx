import { Button } from "@/components/ui/button"
import type { PreviewInventoryEntry } from "@/features/sites/bridge"
import type { Breakpoint, SiteRecord } from "@/features/sites/schema"
import type { SourceElement } from "@/features/sites/source"
import type { SiteMode } from "./Toolbar"
import { SiteCodeView } from "./CodeView"
import { SitePreview } from "./Preview"
import { SiteModeIsland } from "./ModeIsland"

const previewWidths: Record<Breakpoint, number> = {
  base: 1280,
  tablet: 834,
  mobile: 390,
}

export function SiteEditorWorkspace({
  onSaveFile,
  record,
  previewRecord,
  mode,
  onMode,
  breakpoint,
  path,
  file,
  fileLine,
  sourceElements,
  selection,
  command,
  busy,
  error,
  canEdit,
  onReload,
  onCloseFile,
  onSelectElement,
  onInventory,
  onRoute,
  onError,
}: {
  onSaveFile: (path:string,content:string)=>Promise<void>
  record: SiteRecord
  previewRecord: SiteRecord
  mode: SiteMode
  onMode: (mode: SiteMode) => void
  breakpoint: Breakpoint
  path: string
  file: string | null
  fileLine: number | null
  sourceElements: SourceElement[]
  selection: string | null
  command: { type: "back" | "forward"; sequence: number } | null
  busy: boolean
  error: string | null
  canEdit: boolean
  onReload: () => void
  onCloseFile: () => void
  onSelectElement: (
    id: string,
    occurrences: number,
    domTag: string | null
  ) => void
  onInventory: (elements: PreviewInventoryEntry[]) => void
  onRoute: (path: string) => void
  onError: (message: string) => void
}) {
  return (
    <section className="site-editor-center flex-1 min-w-0 flex flex-col bg-muted max-[1100px]:min-w-[480px] relative">
      <div className="flex justify-between border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
        <span>
          {busy
            ? "Validation et sauvegarde…"
            : `Enregistré · version ${record.revision}`}
          {!canEdit ? " · Lecture seule" : ""}
        </span>
        <span>{path}</span>
      </div>
      {error && (
        <div className="site-editor-error p-3 flex gap-3 items-center bg-background text-[12px] text-destructive" role="alert">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={onReload}>
            Recharger
          </Button>
        </div>
      )}
      {file && (
        <SiteCodeView
          key={file}
          canEdit={canEdit && !busy}
          onSave={onSaveFile}
          path={file}
          line={fileLine}
          doc={record.doc}
          onClose={onCloseFile}
        />
      )}
      <div className="site-preview-container [&[hidden]]:hidden flex flex-1 min-h-0 flex-col" hidden={Boolean(file)}>
        <SitePreview
          record={previewRecord}
          sourceElements={sourceElements}
          editing={mode !== "navigation"}
          path={path}
          width={previewWidths[breakpoint]}
          selection={selection}
          command={command}
          onSelect={onSelectElement}
          onInventory={onInventory}
          onRoute={onRoute}
          onError={onError}
        />
      </div>
      <SiteModeIsland mode={mode} onMode={onMode} />
    </section>
  )
}
