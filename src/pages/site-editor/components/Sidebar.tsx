import { SiteLibraries } from "./Libraries"
import type { SiteDocument } from "@/validators/sites/document"
import type { SiteRecord } from "@/features/sites/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteFiles } from "./Files"

export function SiteEditorSidebar({
  record,
  canEdit,
  onUpdated,
  panel,
  onPanelChange,
  doc,
  file,
  onSelectFile,
}: {
  record: SiteRecord
  canEdit: boolean
  onUpdated: () => Promise<void>
  panel: string
  onPanelChange: (panel: string) => void
  doc: SiteDocument
  file: string | null
  onSelectFile: (path: string) => void
}) {
  return (
    <aside className="flex w-64 min-w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20">
      <Tabs
        value={panel}
        onValueChange={onPanelChange}
        className="border-b border-border/60 px-3 py-2"
      >
        <TabsList
          variant="line"
          className="w-full [&_[data-slot=tabs-trigger]]:text-xs [&_[data-slot=tabs-trigger]]:transition-none [&_[data-slot=tabs-trigger]]:after:h-px"
        >
          <TabsTrigger value="files">Fichiers</TabsTrigger>
          <TabsTrigger value="libraries">Bibliothèques</TabsTrigger>
        </TabsList>
      </Tabs>
      <div
        className={
          panel === "files" ? "flex min-h-0 flex-1 flex-col" : "hidden"
        }
        hidden={panel !== "files"}
      >
        <SiteFiles doc={doc} selected={file} onSelect={onSelectFile} />
      </div>
      {panel === "libraries" && (
        <SiteLibraries
          record={record}
          canEdit={canEdit}
          onUpdated={onUpdated}
          onSelectFile={onSelectFile}
        />
      )}
    </aside>
  )
}
