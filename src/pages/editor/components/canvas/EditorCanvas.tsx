import type { RefObject } from "react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { hitTest } from "@/features/editor/geometry"
import { useCanvasGestures } from "@/features/editor/use-canvas-gestures"
import { useShortcuts } from "@/features/editor/use-shortcuts"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { copySelection, pasteSelection } from "@/features/editor/clipboard"
import { orderSelection } from "@/features/editor/arrange"
import { addAutoLayoutToSelection } from "@/features/editor/auto-layout"
import { CanvasWorld } from "./CanvasWorld"
import { SelectionOverlay } from "./SelectionOverlay"
import { CanvasControls } from "./CanvasControls"

export function EditorCanvas({
  toggleLeft,
  toggleRight,
  openLibrary,
  compactControls = false,
  surface,
  fit,
  zoomTo,
  showZoom,
}: {
  surface: RefObject<HTMLDivElement | null>
  fit: (selection?: boolean) => void
  zoomTo: (zoom: number) => void
  showZoom: boolean
  toggleLeft: () => void
  toggleRight: () => void
  openLibrary?: () => void
  compactControls?: boolean
}) {
  const editor = useEditor(),
    state = useEditorState(
      (s) => s,
      (a, b) =>
        a.doc === b.doc &&
        a.rightTab === b.rightTab &&
        a.mode === b.mode &&
        a.tool === b.tool &&
        a.editingTextId === b.editingTextId &&
        a.selectedIds === b.selectedIds
    )
  const inspect = state.rightTab === "inspect"
  const gestures = useCanvasGestures(surface),
    frames = framesOf(state.doc)
  useShortcuts(fit, zoomTo, openLibrary)

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <div
            ref={surface}
            className="editor-canvas relative w-full h-full overflow-clip [background:var(--editor-canvas-background,_#f5f5f5)] outline-none touch-none [isolation:isolate] dark:[background:color-mix(_in_srgb,_var(--editor-canvas-background,_#f5f5f5),_var(--background)_93%_)] [&[data-tool=hand]]:cursor-grab [&[data-tool=hand]:active]:cursor-grabbing [&[data-tool=frame]]:cursor-crosshair [&[data-tool=box]]:cursor-crosshair [&[data-tool=text]]:cursor-crosshair"
            tabIndex={0}
            aria-label="Canvas de la maquette"
            data-tool={gestures.space ? "hand" : state.tool}
            onContextMenu={(event) => {
              if (
                state.mode === "preview" ||
                (event.target as HTMLElement).closest("[data-canvas-control]")
              )
                return
              const rect = event.currentTarget.getBoundingClientRect()
              const id = hitTest(
                editor.state.get(),
                gestures.world({
                  x: event.clientX - rect.x,
                  y: event.clientY - rect.y,
                }),
                event.metaKey || event.ctrlKey
              )
              if (id && !editor.state.get().selectedIds.includes(id))
                editor.select(id)
            }}
            onDragOver={(event) => {
              if (inspect) return
              if (
                event.dataTransfer.types.includes(
                  "application/x-digit-component"
                )
              )
                event.preventDefault()
            }}
            onDrop={(event) => {
              if (inspect) return
              const name = event.dataTransfer.getData(
                "application/x-digit-component"
              )
              if (!name || !surface.current) return
              event.preventDefault()
              const rect = surface.current.getBoundingClientRect(),
                point = gestures.world({
                  x: event.clientX - rect.x,
                  y: event.clientY - rect.y,
                })
              editor.insert(
                name,
                hitTest(editor.state.get(), point, true) ?? undefined,
                undefined,
                point
              )
            }}
          />
        }
      >
        <CanvasWorld />
        <div
          className="editor-hit-plane absolute [inset:0] z-[1]"
          style={{
            pointerEvents:
              state.mode === "preview" || state.editingTextId ? "none" : "auto",
          }}
        />
        <SelectionOverlay />
        <CanvasControls
          fit={fit}
          zoomTo={zoomTo}
          showZoom={showZoom}
          toggleLeft={toggleLeft}
          toggleRight={toggleRight}
          compact={compactControls}
        />
        {state.mode === "preview" && (
          <div className="editor-mode-label absolute z-[4] top-[17px] left-[50%] -translate-x-1/2 py-1.5 px-2.5 rounded-md bg-popover text-muted-foreground text-[11px] whitespace-nowrap">
            Aperçu interactif · Échap pour revenir
          </div>
        )}
        {!frames.length && (
          <div className="editor-canvas-empty absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground pointer-events-none whitespace-nowrap [&_p]:text-foreground [&_p]:text-[16px] [&_p]:font-medium [&_p]:mb-1.75">
            <p>Un espace pour vos idées</p>
            <span>Appuyez sur F pour créer votre première frame.</span>
          </div>
        )}
        <div className="editor-canvas-hint absolute left-[16px] bottom-[19px] text-muted-foreground text-[10px] opacity-[0.75] pointer-events-none [&_span]:px-0.75 max-[1200px]:hidden">
          Espace pour déplacer <span>·</span> ⌘ molette pour zoomer
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={!state.selectedIds.length}
            onClick={() => void copySelection(editor)}
          >
            Copier
          </ContextMenuItem>
          <ContextMenuItem
            disabled={inspect}
            onClick={() => void pasteSelection(editor)}
          >
            Coller
          </ContextMenuItem>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={() => editor.duplicate()}
          >
            Dupliquer
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={() => orderSelection(editor, "front")}
          >
            Mettre au premier plan
          </ContextMenuItem>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={() => orderSelection(editor, "back")}
          >
            Mettre à l’arrière-plan
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={() => addAutoLayoutToSelection(editor)}
          >
            Ajouter un auto-layout
          </ContextMenuItem>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={editor.ungroup}
          >
            Dissocier le conteneur
          </ContextMenuItem>
          <ContextMenuItem
            disabled={inspect || !state.selectedIds.length}
            onClick={editor.remove}
          >
            Supprimer
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
