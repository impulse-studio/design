import type { SiteRuntimeStatus } from "@/features/sites/runtime"
import type { PreviewInventoryEntry } from "@/validators/sites/preview"
import type { SourceElement } from "@/features/sites/source"
import type { SiteRecord } from "@/features/sites/types"
import { useSitePreviewSession } from "@/features/sites/use-preview-session"
import { Spinner } from "@/components/ui/spinner"
import { SitePreviewOverlay } from "./PreviewOverlay"

export function SitePreview({
  record,
  sourceElements,
  editing,
  path,
  width,
  selection,
  command,
  onSelect,
  onInventory,
  onRoute,
  onError,
  onStatus,
}: {
  record: SiteRecord
  sourceElements: SourceElement[]
  editing: boolean
  path: string
  width: number
  selection: string | null
  command: { type: "back" | "forward"; sequence: number } | null
  onSelect: (id: string, count: number, domTag: string | null) => void
  onInventory: (elements: PreviewInventoryEntry[]) => void
  onRoute: (path: string) => void
  onError: (message: string) => void
  onStatus: (status: SiteRuntimeStatus) => void
}) {
  const session = useSitePreviewSession({
    record,
    sourceElements,
    editing,
    path,
    selection,
    command,
    onSelect,
    onInventory,
    onRoute,
    onError,
    onStatus,
  })
  return (
    <div className="site-preview-area block min-h-0 flex-1 overflow-auto p-4">
      <div
        className="site-preview-device relative mx-auto h-full overflow-hidden rounded-md border border-border/60 bg-white"
        style={{ width }}
      >
        {(session.loading || session.status.stage === "error") && (
          <div
            className="site-preview-loading absolute [inset:0] z-[1] flex items-center justify-center gap-2 bg-background text-[12px]"
            role="status"
          >
            {session.status.stage !== "error" && <Spinner />}
            <span>{session.status.message}</span>
          </div>
        )}
        <iframe
          ref={session.iframe}
          title="Aperçu du site"
          referrerPolicy="no-referrer"
          src={session.url || undefined}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          className="site-preview-frame block h-full min-h-[500px] w-full border-0"
        />
        {editing && (
          <SitePreviewOverlay
            hover={session.hover}
            selection={session.selectionTarget}
          />
        )}
      </div>
    </div>
  )
}
