import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  RiArrowLeftLine,
  RiSideBarLine,
  RiDownloadLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "@remixicon/react"
import { MockupLinks } from "@/components/mockups/MockupLinks"
import type { ExportStatus } from "@/features/sites/export-session"

export type SiteMode = "navigation" | "dev" | "edit"

export function SiteToolbar({
  sidebarVisible,
  onToggleSidebar,
  name,
  mockupId,
  notionUrl,
  githubUrl,
  busy,
  canEdit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  exportStatus,
}: {
  sidebarVisible: boolean
  onToggleSidebar: () => void
  name: string
  mockupId: string
  notionUrl: string | null
  githubUrl: string | null
  busy: boolean
  canEdit: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onExport: () => void
  exportStatus: ExportStatus
}) {
  const exportBusy = ["installing", "building", "archiving"].includes(
    exportStatus.stage
  )
  return (
    <header className="site-toolbar flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-border/60 bg-background px-3 py-2">
      <Button
        variant="ghost"
        size="icon-sm"
        render={<Link to="/" />}
        nativeButton={false}
        aria-label="Retour au studio"
      >
        <RiArrowLeftLine className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={
          sidebarVisible
            ? "Masquer le panneau latéral"
            : "Afficher le panneau latéral"
        }
        aria-expanded={sidebarVisible}
        aria-controls="site-sidebar"
        onClick={onToggleSidebar}
        className="text-muted-foreground"
      >
        <RiSideBarLine />
      </Button>
      <span className="site-project-name max-w-[160px] overflow-hidden text-[13px] font-medium text-ellipsis whitespace-nowrap">
        {name}
      </span>
      <MockupLinks
        compact
        id={mockupId}
        notionUrl={notionUrl}
        githubUrl={githubUrl}
        canEdit={canEdit}
      />
      <div className="ml-auto flex items-center gap-1 text-muted-foreground">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Annuler"
          disabled={busy || !canEdit || !canUndo}
          onClick={onUndo}
        >
          <RiArrowGoBackLine />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Rétablir"
          disabled={busy || !canEdit || !canRedo}
          onClick={onRedo}
        >
          <RiArrowGoForwardLine />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={busy || exportBusy}
          onClick={onExport}
        >
          <RiDownloadLine data-icon="inline-start" />
          {exportBusy
            ? exportStatus.message
            : exportStatus.stage === "error"
              ? "Réessayer l’export"
              : "Exporter"}
        </Button>
      </div>
      {exportStatus.stage === "error" && (
        <p role="alert" className="w-full text-xs text-destructive">
          {exportStatus.message}
        </p>
      )}
      {exportBusy && (
        <span role="status" className="sr-only">
          {exportStatus.message}
        </span>
      )}
    </header>
  )
}
