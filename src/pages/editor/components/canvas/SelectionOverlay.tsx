import { useSelector } from "@tanstack/react-store"
import { useEditor, useEditorState } from "@/features/editor/context"
import { bounds } from "@/features/editor/geometry"
import { frameDimension, geometryIndex } from "@/features/editor/geometry-index"
import { isEditable, topSelected } from "@/features/editor/tree"
import { CanvasOutline } from "./CanvasOutline"
import { CanvasGuide } from "./CanvasGuide"
import { CanvasMeasurement } from "./CanvasMeasurement"

export function SelectionOverlay() {
  const editor = useEditor(),
    draft = useSelector(editor.canvas.draft)
  const state = useEditorState(
    (s) => s,
    (a, b) =>
      a.doc === b.doc &&
      a.layouts === b.layouts &&
      a.selectedIds === b.selectedIds &&
      a.hoveredId === b.hoveredId &&
      a.rightTab === b.rightTab &&
      a.mode === b.mode &&
      a.editingTextId === b.editingTextId
  )
  const displayed = { ...state, ...draft },
    ids = topSelected(displayed.doc, displayed.selectedIds),
    index = geometryIndex(displayed)
  const getRect = (id: string) => {
    const visual = editor.canvas.visual.get(),
      entry = index.byId.get(id),
      preview = visual.preview?.rects[id]
    if (preview) return preview
    const size = visual.frameSizes[id]
    if (size && entry?.node.type === "frame" && entry.rect)
      return {
        ...entry.rect,
        width: frameDimension(entry.node, "width", size.width),
        height: frameDimension(entry.node, "height", size.height),
      }
    return entry?.rect ?? null
  }
  if (state.mode === "preview" || state.editingTextId) return null
  return (
    <div className="editor-overlay absolute [inset:0] z-[2] pointer-events-none">
      <CanvasOutline
        className="editor-hover-outline absolute border [border-color:var(--editor-selection)] opacity-[0.65]"
        getRect={() =>
          state.hoveredId && !ids.includes(state.hoveredId)
            ? getRect(state.hoveredId)
            : null
        }
      />
      <CanvasOutline
        className="editor-selection-outline absolute border [border-color:var(--editor-selection)]"
        getRect={() =>
          bounds(
            ids.flatMap((id) => {
              const r = getRect(id)
              return r ? [r] : []
            })
          )
        }
        label
        handles={
          state.rightTab === "design" &&
          ids.length > 0 &&
          ids.every((id) => isEditable(displayed.doc, id))
        }
      />
      {ids.length > 1 &&
        ids.map((id) => (
          <CanvasOutline
            key={id}
            className="editor-hover-outline absolute border [border-color:var(--editor-selection)] opacity-[0.65]"
            getRect={() => getRect(id)}
          />
        ))}
      <CanvasOutline
        className="editor-marquee absolute border [border-color:var(--editor-selection)] [background:color-mix(in_srgb,_var(--editor-selection),_transparent_92%)]"
        getRect={() => editor.canvas.visual.get().marquee}
      />
      <CanvasGuide axis="x" />
      <CanvasGuide axis="y" />
      <CanvasMeasurement />
    </div>
  )
}
