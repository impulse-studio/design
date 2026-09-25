import { Button } from "@/components/ui/button"
import type { PreviewInventoryEntry } from "@/validators/sites/preview"
import type { Breakpoint } from "@/validators/sites/document"
import type { SiteRecord } from "@/features/sites/types"
import type { SourceElement } from "@/features/sites/source"
import type { SiteMode } from "./Toolbar"
import type { SiteRuntimeStatus } from "@/features/sites/runtime"
import { SiteCodeView } from "./CodeView"
import { SitePreview } from "./Preview"
import { SiteModeIsland } from "./ModeIsland"
import { SitePreviewToolbar } from "./PreviewToolbar"
import type { ComponentProps } from "react"

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
  previewToolbar,
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
  onRuntimeStatus,
}: {
  onSaveFile: (path: string, content: string) => Promise<void>
  record: SiteRecord
  previewRecord: SiteRecord
  mode: SiteMode
  onMode: (mode: SiteMode) => void
  previewToolbar: ComponentProps<typeof SitePreviewToolbar>
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
  onRuntimeStatus: (status: SiteRuntimeStatus) => void
}) {
  return (
    <section className="site-editor-center relative flex min-w-0 flex-1 flex-col bg-muted/40">
      <SitePreviewToolbar {...previewToolbar} />
      {error && (
        <div
          className="site-editor-error flex items-center gap-3 bg-background p-3 text-[12px] text-destructive"
          role="alert"
        >
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
      <div
        className="site-preview-container flex min-h-0 flex-1 flex-col [&[hidden]]:hidden"
        hidden={Boolean(file)}
      >
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
          onStatus={onRuntimeStatus}
        />
      </div>
      <SiteModeIsland mode={mode} onMode={onMode} />
      <footer className="flex h-8 shrink-0 items-center justify-between gap-3 px-4 text-[0.6875rem] text-muted-foreground">
        <span role="status">
          {busy ? "Enregistrement…" : "Enregistré"}
          {!canEdit ? " · Lecture seule" : ""}
        </span>
        <span className="truncate" title={path}>
          {path}{" "}
          <span className="ml-3 tabular-nums opacity-60">
            v{record.revision}
          </span>
        </span>
      </footer>
    </section>
  )
}
