import { RiCloseLine } from "@remixicon/react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { MockupRecord } from "@/features/mockups/types"
import { useMockupSession } from "@/features/mockups/use-session"
import { useEditor, useEditorState } from "@/features/editor/context"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { EditorLeftPanel } from "@/pages/editor/components/left-panel/EditorLeftPanel"
import { EditorHeader } from "@/pages/editor/components/header/EditorHeader"
import { InspectorHeader } from "@/pages/editor/components/header/InspectorHeader"
import { InspectorPanel } from "@/pages/editor/components/inspector/InspectorPanel"
import { EditorCanvas } from "@/pages/editor/components/canvas/EditorCanvas"
import { EditorToolbar } from "@/pages/editor/components/toolbar/EditorToolbar"
import { useCanvasViewport } from "@/features/editor/use-canvas-viewport"
import { useCollapsiblePanel } from "@/features/editor/use-collapsible-panel"
import { AiChatProvider } from "@/pages/editor/components/chat/AiChatProvider"
import { EditorPersistenceContext } from "@/features/mockups/persistence-context"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const INSPECTOR_ASIDE_CLASS =
  "flex h-full min-h-0 min-w-0 flex-col bg-background text-[11px] text-foreground motion-reduce:**:animate-none! motion-reduce:**:transition-none!"

export function EditorShell({ initial }: { initial: MockupRecord }) {
  const isMobile = useIsMobile()
  const [mobilePanel, setMobilePanel] = useState<
    "library" | "inspector" | null
  >(null)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const editor = useEditor(),
    state = useEditorState(
      (s) => s,
      (a, b) =>
        a.libraryVisible === b.libraryVisible &&
        a.inspectorVisible === b.inspectorVisible &&
        a.rightTab === b.rightTab &&
        a.doc.pages[0].background === b.doc.pages[0].background &&
        a.transaction === b.transaction &&
        a.notice === b.notice
    ),
    save = useMockupSession(editor, initial),
    left = state.libraryVisible,
    right = state.inspectorVisible
  const openMobileLibrary = useCallback(() => {
    editor.set({ tab: "components" })
    setMobilePanel("library")
  }, [editor])
  const { surface, fit, zoomTo } = useCanvasViewport()
  const library = useCollapsiblePanel(left, (visible) =>
    editor.set({ libraryVisible: visible })
  )
  const inspector = useCollapsiblePanel(right, (visible) =>
    editor.set({ inspectorVisible: visible })
  )
  useEffect(() => setPortalTarget(document.body), [])
  const notice =
    save.recovery ||
    save.status === "conflict" ||
    save.status === "error" ||
    state.notice ? (
      <div
        className="fixed top-4 left-1/2 z-[60] flex w-fit max-w-[min(720px,90vw)] -translate-x-1/2 items-center gap-2.5 rounded-[9px] border border-border bg-popover px-3 py-[9px] text-xs shadow-[0_4px_20px_#00000014]"
        role="status"
      >
        {save.recovery ? (
          <>
            <span className="max-w-[480px] [overflow-wrap:anywhere]">
              Un brouillon non enregistré a été retrouvé.
            </span>
            <Button size="sm" onClick={save.recover}>
              Récupérer
            </Button>
            <Button size="sm" variant="ghost" onClick={save.discard}>
              Ignorer
            </Button>
          </>
        ) : save.status === "conflict" ? (
          <>
            <span className="max-w-[480px] [overflow-wrap:anywhere]">
              Une version plus récente existe. Votre brouillon est conservé.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => location.reload()}
            >
              Recharger
            </Button>
          </>
        ) : save.status === "error" ? (
          <>
            <span className="max-w-[480px] [overflow-wrap:anywhere]">
              La sauvegarde a échoué. Votre brouillon est conservé.
            </span>
            <Button size="sm" onClick={save.retry}>
              Réessayer
            </Button>
          </>
        ) : (
          <>
            <span className="max-w-[480px] [overflow-wrap:anywhere]">
              {state.notice}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Fermer le message"
              onClick={() => editor.set({ notice: null })}
            >
              <RiCloseLine />
            </Button>
          </>
        )}
      </div>
    ) : null
  const rootClassName = isMobile
    ? "editor-shell relative flex flex-col"
    : "editor-shell"
  const root = isMobile ? (
    <div
      className={rootClassName}
      data-mode={state.rightTab}
      style={
        {
          "--editor-canvas-background": state.doc.pages[0].background,
        } as React.CSSProperties
      }
    >
      <EditorHeader
        compact
        mockupId={initial.id}
        notionUrl={initial.notionUrl}
        githubUrl={initial.githubUrl}
        canEdit={!editor.readOnly}
        status={save.status}
        retry={save.retry}
      />
      <InspectorHeader />
      <div className="relative min-h-0 flex-1">
        <EditorCanvas
          surface={surface}
          fit={fit}
          zoomTo={zoomTo}
          showZoom
          openLibrary={openMobileLibrary}
          compactControls
          toggleLeft={() =>
            setMobilePanel((current) =>
              current === "library" ? null : "library"
            )
          }
          toggleRight={() =>
            setMobilePanel((current) =>
              current === "inspector" ? null : "inspector"
            )
          }
        />
        <EditorToolbar compact openLibrary={openMobileLibrary} />
      </div>

      <Sheet
        open={mobilePanel === "library"}
        onOpenChange={(open) => setMobilePanel(open ? "library" : null)}
      >
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(88vw,360px)] max-w-none gap-0 p-0"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
            <SheetTitle>Bibliothèque</SheetTitle>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-11"
                  aria-label="Fermer la bibliothèque"
                />
              }
            >
              <RiCloseLine />
            </SheetClose>
          </div>
          <div className="min-h-0 flex-1">
            <EditorLeftPanel
              mockupId={initial.id}
              notionUrl={initial.notionUrl}
              githubUrl={initial.githubUrl}
              status={save.status}
              retry={save.retry}
              showHeader={false}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Sheet
        open={mobilePanel === "inspector"}
        onOpenChange={(open) => setMobilePanel(open ? "inspector" : null)}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[min(88vw,360px)] max-w-none gap-0 p-0"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
            <SheetTitle>Inspecteur</SheetTitle>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-11"
                  aria-label="Fermer l’inspecteur"
                />
              }
            >
              <RiCloseLine />
            </SheetClose>
          </div>
          <aside
            className={cn(INSPECTOR_ASIDE_CLASS, "flex-1")}
            aria-label="Inspecteur"
          >
            <InspectorPanel fit={fit} zoomTo={zoomTo} />
          </aside>
        </SheetContent>
      </Sheet>
    </div>
  ) : (
    <div
      className={rootClassName}
      data-mode={state.rightTab}
      style={
        {
          "--editor-canvas-background": state.doc.pages[0].background,
        } as React.CSSProperties
      }
    >
      <ResizablePanelGroup orientation="horizontal" id="studio-editor-panels">
        <ResizablePanel
          id="library"
          className="editor-collapsible-panel [#inspector_>_&]:flex [#inspector_>_&]:justify-end [&_>_*]:min-w-[240px]"
          style={{ overflow: "hidden" }}
          panelRef={library.panelRef}
          elementRef={library.elementRef}
          onResize={library.onResize}
          collapsible
          collapsedSize={0}
          defaultSize={280}
          minSize={240}
          maxSize={420}
        >
          <EditorLeftPanel
            mockupId={initial.id}
            notionUrl={initial.notionUrl}
            githubUrl={initial.githubUrl}
            status={save.status}
            retry={save.retry}
          />
        </ResizablePanel>
        <ResizableHandle hidden={!left} />
        <ResizablePanel id="canvas" minSize={240}>
          <EditorCanvas
            surface={surface}
            fit={fit}
            zoomTo={zoomTo}
            showZoom={!right}
            toggleLeft={() => editor.set({ libraryVisible: !left })}
            toggleRight={() => editor.set({ inspectorVisible: !right })}
          />
        </ResizablePanel>
        <ResizableHandle hidden={!right} />
        <ResizablePanel
          id="inspector"
          className="editor-collapsible-panel [#inspector_>_&]:flex [#inspector_>_&]:justify-end [&_>_*]:min-w-[240px]"
          style={{ overflow: "hidden" }}
          panelRef={inspector.panelRef}
          elementRef={inspector.elementRef}
          onResize={inspector.onResize}
          collapsible
          collapsedSize={0}
          defaultSize={320}
          minSize={240}
          maxSize={440}
        >
          <aside
            className={cn(INSPECTOR_ASIDE_CLASS, "w-full")}
            aria-label="Inspecteur"
          >
            <InspectorHeader />
            <InspectorPanel fit={fit} zoomTo={zoomTo} />
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
      <EditorToolbar />
    </div>
  )
  return (
    <EditorPersistenceContext.Provider value={save}>
      <AiChatProvider mockupId={initial.id}>
        {root}
        {portalTarget && notice ? createPortal(notice, portalTarget) : null}
      </AiChatProvider>
    </EditorPersistenceContext.Provider>
  )
}
