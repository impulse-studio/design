import { AccountMenu } from "@/components/auth/AccountMenu"
import { useRef } from "react"
import { Link } from "@tanstack/react-router"
import {
  RiArrowDownSLine,
  RiHomeLine,
  RiDownloadLine,
  RiUploadLine,
  RiCheckLine,
  RiRefreshLine,
} from "@remixicon/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import type { SaveStatus } from "@/features/mockups/save-queue"
import { Button } from "@/components/ui/button"
import { MockupNameForm } from "./MockupNameForm"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { BrandMark } from "@/components/shared/BrandMark"

import { MockupStatusMenu } from "@/components/mockups/MockupStatusMenu"
import { MockupLinks } from "@/components/mockups/MockupLinks"
import { APP_ROUTES, DESIGN_SYSTEM_NAME } from "@/constants"

const statuses: Record<SaveStatus, string> = {
  saved: "Enregistré",
  dirty: "Modifications…",
  saving: "Enregistrement…",
  error: "Échec de sauvegarde",
  conflict: "Conflit de version",
}
const saveIndicatorLabels: Record<SaveStatus, string> = {
  saved: "Enregistré",
  dirty: "À enregistrer",
  saving: "Enregistrement…",
  error: "Réessayer",
  conflict: "Conflit",
}
export function EditorHeader({
  mockupId,
  notionUrl,
  githubUrl,
  canEdit,
  status,
  retry,
  compact = false,
}: {
  mockupId: string
  notionUrl: string | null
  githubUrl: string | null
  canEdit: boolean
  status: SaveStatus
  retry: () => void
  compact?: boolean
}) {
  const editor = useEditor(),
    inspect = useEditorState((s) => s.rightTab === "inspect"),
    name = useEditorState((s) => s.name),
    lifecycle = useEditorState((s) => s.status),
    file = useRef<HTMLInputElement>(null)
  const saveLabel = editor.readOnly ? "Lecture seule" : statuses[status]
  const saveIndicatorLabel = editor.readOnly
    ? "Lecture seule"
    : saveIndicatorLabels[status]
  const exportDoc = () => {
    const blob = new Blob([JSON.stringify(editor.state.get().doc, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      link = document.createElement("a")
    link.href = url
    link.download = `${name}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <header
      className={
        compact
          ? "flex h-12 shrink-0 items-center gap-1 border-b px-2"
          : "editor-project-header grid grid-cols-[32px_minmax(0,_1fr)_40px] items-center gap-2 min-h-[76px] flex-none p-2 border-b border-border [@media(pointer:coarse)]:min-h-[104px] [@media(pointer:coarse)]:py-2"
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={
                compact
                  ? "size-8 min-h-11 min-w-11 shrink-0 gap-0 p-1 md:min-h-8 md:min-w-8"
                  : "editor-project-brand-trigger w-[32px] h-[32px] gap-[0] p-1"
              }
              aria-label="Menu du studio"
            />
          }
        >
          <BrandMark compact />
          <RiArrowDownSLine />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link to={APP_ROUTES.studio} />}>
              <RiHomeLine />
              Toutes les maquettes
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to={APP_ROUTES.designSystem} />}>
              Bibliothèque {DESIGN_SYSTEM_NAME}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={exportDoc}>
              <RiDownloadLine />
              Exporter le document JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={inspect}
              onClick={() => file.current?.click()}
            >
              <RiUploadLine />
              Importer un document JSON
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {compact ? (
        <div className="min-w-0 flex-1">
          <MockupNameForm
            name={name}
            readOnly={inspect}
            onRename={editor.rename}
          />
        </div>
      ) : (
        <div className="editor-project-content flex min-w-0 flex-col gap-0.75">
          <div className="editor-project-primary flex min-w-0 items-center h-[28px] gap-1 [&_>_form]:min-w-0 [&_>_form]:flex-1 [&_[data-slot=field]]:min-w-0 [@media(pointer:coarse)]:h-auto [@media(pointer:coarse)]:min-h-[44px]">
            <MockupNameForm
              name={name}
              readOnly={inspect}
              onRename={editor.rename}
            />
            {status === "error" ? (
              <Button
                variant="ghost"
                size="xs"
                className="editor-project-save-status inline-flex h-[24px] min-w-0 shrink-0 items-center gap-1 rounded-full [padding:0_4px] text-muted-foreground text-[10px] leading-[1] whitespace-nowrap [&_>_svg]:w-[13px] [&_>_svg]:h-[13px] [&[data-state=saved]]:[color:var(--status-done)] [&[data-state=conflict]]:[color:var(--status-progress)] [&[data-state=error]]:text-destructive"
                data-state={status}
                onClick={retry}
                aria-label={`État de sauvegarde : ${saveLabel}`}
                title={saveLabel}
              >
                <RiRefreshLine />
                <span>{saveIndicatorLabel}</span>
              </Button>
            ) : (
              <span
                className="editor-project-save-status inline-flex h-[24px] min-w-0 shrink-0 items-center gap-1 rounded-full [padding:0_4px] text-muted-foreground text-[10px] leading-[1] whitespace-nowrap [&_>_svg]:w-[13px] [&_>_svg]:h-[13px] [&[data-state=saved]]:[color:var(--status-done)] [&[data-state=conflict]]:[color:var(--status-progress)] [&[data-state=error]]:text-destructive"
                data-state={status}
                role="status"
                aria-label={`État de sauvegarde : ${saveLabel}`}
                aria-live="polite"
                title={saveLabel}
              >
                {status === "saved" ? (
                  <RiCheckLine />
                ) : (
                  <span className="editor-status-dot w-[4px] h-[4px] rounded-full bg-current" />
                )}
                <span>{saveIndicatorLabel}</span>
              </span>
            )}
          </div>
          <div className="editor-project-secondary flex min-w-0 items-center min-h-[25px] flex-wrap gap-1 [&_>_[data-slot=dropdown-menu]]:min-w-0 [&_.mockup-status]:shrink-0 [@media(pointer:coarse)]:min-h-[44px]">
            <MockupStatusMenu
              disabled={inspect}
              value={lifecycle}
              onChange={editor.setStatus}
            />
            <MockupLinks
              id={mockupId}
              notionUrl={notionUrl}
              githubUrl={githubUrl}
              canEdit={canEdit && !inspect}
              compact
              actionLabel="Liens"
            />
          </div>
        </div>
      )}
      {compact && (
        <>
          <MockupStatusMenu
            disabled={inspect}
            value={lifecycle}
            onChange={editor.setStatus}
            compact
          />
          <MockupLinks
            id={mockupId}
            notionUrl={notionUrl}
            githubUrl={githubUrl}
            canEdit={canEdit && !inspect}
            compact
            hideActiveLinks={canEdit && !inspect}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 min-h-11 min-w-11 shrink-0 text-muted-foreground data-[state=conflict]:text-status-progress data-[state=error]:text-destructive md:min-h-7 md:min-w-7"
            data-state={status}
            onClick={status === "error" ? retry : undefined}
            aria-live="polite"
            aria-label={`État de sauvegarde : ${saveLabel}`}
            title={saveLabel}
          >
            {status === "saved" ? (
              <RiCheckLine />
            ) : status === "error" ? (
              <RiRefreshLine />
            ) : (
              <span className="size-1 rounded-full bg-current" />
            )}
          </Button>
        </>
      )}
      {!compact && <AccountMenu />}
      <input
        ref={file}
        className="hidden"
        type="file"
        accept="application/json,.json"
        aria-label="Importer une maquette"
        onChange={async (event) => {
          const selected = event.target.files?.[0]
          if (!selected) return
          try {
            if (selected.size > 10_000_000)
              throw new Error("Document trop volumineux")
            editor.replace(JSON.parse(await selected.text()))
          } catch (error) {
            editor.set({
              notice:
                error instanceof Error ? error.message : "Document invalide",
            })
          }
          event.target.value = ""
        }}
      />
    </header>
  )
}
