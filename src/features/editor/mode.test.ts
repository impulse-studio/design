import { expect, it } from "vitest"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"

const setup = () =>
  createEditor({ name: "Modes", status: "draft", doc: emptyDocument() })
it("enters Dev Mode atomically, commits a current edit, preserves selection/viewport and reopens the inspector", () => {
  const editor = setup(),
    [id] = editor.insert("text")
  const viewport = editor.state.get().viewport,
    past = editor.state.get().past.length
  editor.set({ inspectorVisible: false, tool: "text", editingTextId: id })
  editor.begin()
  editor.updateSelection((node) => {
    node.name = "Changed"
  })
  editor.setEditorMode("inspect")
  expect(editor.state.get()).toMatchObject({
    rightTab: "inspect",
    inspectorVisible: true,
    tool: "move",
    editingTextId: null,
    transaction: null,
    selectedIds: [id],
    viewport,
  })
  expect(editor.state.get().past).toHaveLength(past + 1)
})
it("blocks every document mutation and undo in Dev Mode while allowing navigation and returning to Design", () => {
  const editor = setup(),
    [id] = editor.insert("text")
  const frame = framesOf(editor.state.get().doc)[0]
  editor.setEditorMode("inspect")
  const state = editor.state.get()
  editor.begin()
  editor.change((doc) => {
    doc.pages[0].background = "#000000"
  })
  editor.updateSelection((node) => {
    node.name = "No"
  }, true)
  editor.rename("No")
  editor.setStatus("approved")
  expect(editor.addFrame()).toBeNull()
  expect(editor.insert("text")).toEqual([])
  expect(editor.insertNodes([])).toEqual([])
  editor.moveNodes([id], frame.id)
  editor.remove()
  editor.duplicate()
  editor.group()
  editor.ungroup()
  editor.replace(emptyDocument())
  editor.undo()
  editor.redo()
  expect(editor.state.get()).toBe(state)
  editor.select(frame.id)
  editor.zoomAt({ x: 10, y: 10 }, 2)
  expect(editor.state.get().selectedIds).toEqual([frame.id])
  expect(editor.state.get().viewport.zoom).toBe(1)
  editor.setEditorMode("design")
  editor.updateSelection((node) => {
    node.name = "Allowed"
  })
  expect(framesOf(editor.state.get().doc)[0].name).toBe("Allowed")
})
it("canceling an edit restores redo and the selection before an Alt duplicate", () => {
  const editor = setup(),
    [id] = editor.insert("text")
  editor.rename("Renamed")
  editor.undo()
  const previous = editor.state.get()
  editor.begin()
  editor.duplicate()
  editor.cancel()
  expect(editor.state.get().doc).toBe(previous.doc)
  expect(editor.state.get().future).toBe(previous.future)
  expect(editor.state.get().selectedIds).toEqual([id])
})
it("rejects non-finite viewport data and clamps zoom limits", () => {
  const editor = setup(),
    viewport = editor.state.get().viewport
  editor.setViewport({ x: NaN, y: 0, zoom: 1 })
  editor.zoomAt({ x: 0, y: 0 }, Infinity)
  expect(editor.state.get().viewport).toBe(viewport)
  editor.zoomAt({ x: 0, y: 0 }, 10000)
  expect(editor.state.get().viewport.zoom).toBe(4)
  editor.zoomAt({ x: 0, y: 0 }, 0.00001)
  expect(editor.state.get().viewport.zoom).toBe(0.05)
})
