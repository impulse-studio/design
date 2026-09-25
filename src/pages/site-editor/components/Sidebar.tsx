import { SiteLibraries } from "./Libraries"
import type { SiteRecord } from "@/features/sites/schema"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SiteDocument } from "@/features/sites/schema"
import type { useSiteChat } from "@/features/sites/use-chat"
import { SiteChat } from "./Chat"
import { SiteFiles } from "./Files"

export function SiteEditorSidebar({
  record, canEdit, onUpdated,
  panel,
  onPanelChange,
  chat,
  chatDisabled,
  selection,
  runtimeError,
  doc,
  file,
  onSelectFile,
}: {
  record: SiteRecord
  canEdit: boolean
  onUpdated: () => Promise<void>
  panel: string
  onPanelChange: (panel: string) => void
  chat: ReturnType<typeof useSiteChat>
  chatDisabled: boolean
  selection: string | null
  runtimeError: string | null
  doc: SiteDocument
  file: string | null
  onSelectFile: (path: string) => void
}) {
  return (
    <aside className="flex w-[300px] min-w-[260px] shrink-0 flex-col border-r border-border">
      <Tabs
        value={panel}
        onValueChange={onPanelChange}
        className="border-b border-border px-3 py-2.5"
      >
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Fichiers</TabsTrigger>
          <TabsTrigger value="libraries">Bibliothèques</TabsTrigger>
        </TabsList>
      </Tabs>
      <div
        className={panel === "chat" ? "flex min-h-0 flex-1 flex-col" : "hidden"}
        hidden={panel !== "chat"}
      >
        <SiteChat
          chat={chat}
          disabled={chatDisabled}
          selection={selection}
          error={runtimeError}
        />
      </div>
      <div
        className={
          panel === "files" ? "flex min-h-0 flex-1 flex-col" : "hidden"
        }
        hidden={panel !== "files"}
      >
        <SiteFiles doc={doc} selected={file} onSelect={onSelectFile} />
      </div>
      {panel === "libraries" && <SiteLibraries record={record} canEdit={canEdit} onUpdated={onUpdated} onSelectFile={onSelectFile}/>}
    </aside>
  )
}
