import { describe, expect, it } from "vitest"
import { findNode, validateDocument, walk } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { library, libraryEntries, insertionIssue } from "./library"
import { hitTest } from "./geometry"

const setup = () =>
  createEditor({ name: "Test", status: "draft", doc: emptyDocument() })
describe("editor document operations", () => {
  it("keeps readers in inspect mode and blocks edits through shortcuts and imported drafts", () => {
    const doc = emptyDocument()
    const editor = createEditor(
      { name: "Read only", status: "draft", doc },
      true
    )
    editor.setEditorMode("design")
    editor.set({
      rightTab: "design",
      doc: emptyDocument(),
      name: "Changed",
      status: "approved",
      editingTextId: "text",
    })
    editor.rename("Changed")
    editor.setStatus("approved")
    editor.addFrame("mobile")
    editor.insert("text")
    editor.replace(emptyDocument())
    editor.undo()
    editor.redo()
    expect(editor.state.get()).toMatchObject({
      name: "Read only",
      status: "draft",
      rightTab: "inspect",
      editingTextId: null,
      past: [],
    })
    expect(editor.state.get().doc).toBe(doc)
    editor.set({ mode: "preview" })
    expect(editor.state.get().mode).toBe("preview")
  })
  it("starts with one empty desktop and creates independent frames", () => {
    const editor = setup()
    const frame = framesOf(editor.state.get().doc)[0]
    expect(frame).toMatchObject({ width: 1440, height: 900, children: [] })
    editor.addFrame("mobile")
    expect(framesOf(editor.state.get().doc)).toHaveLength(2)
    editor.undo()
    expect(framesOf(editor.state.get().doc)).toHaveLength(1)
    editor.redo()
    expect(framesOf(editor.state.get().doc)).toHaveLength(2)
  })
  it("records a continuous drag or text input as one undo and cancels a transaction", () => {
    const editor = setup()
    const [id] = editor.insert("text")
    const original = editor.state.get().doc
    const past = editor.state.get().past.length
    editor.begin()
    for (let index = 0; index < 10; index++)
      editor.updateNodes([id], (node) => {
        if (node.type === "text") node.content = `Edit ${index}`
      })
    expect(editor.state.get().past).toHaveLength(past)
    editor.commit()
    expect(editor.state.get().past).toHaveLength(past + 1)
    editor.undo()
    expect(editor.state.get().doc).toBe(original)
    editor.redo()
    expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
      content: "Edit 9",
    })
    editor.begin()
    editor.remove()
    editor.cancel()
    expect(findNode(framesOf(editor.state.get().doc), id)).not.toBeNull()
  })
  it("clones every slot descendant ID and prevents edits through locked parents", () => {
    const editor = setup()
    const [id] = editor.insert("DigiAccordion")
    editor.duplicate()
    const ids: string[] = []
    framesOf(editor.state.get().doc).forEach((frame) =>
      walk(frame, (node) => ids.push(node.id))
    )
    expect(new Set(ids).size).toBe(ids.length)
    editor.updateNodes([id], (node) => {
      node.locked = true
    })
    const location = findNode(framesOf(editor.state.get().doc), id)!
    const child =
      location.node.type === "component"
        ? location.node.slots!.default[0]
        : null
    expect(child).not.toBeNull()
    const doc = editor.state.get().doc
    editor.updateNodes([child!.id], (node) => {
      node.name = "Blocked"
    })
    expect(editor.state.get().doc).toBe(doc)
    editor.select(child!.id)
    editor.remove()
    expect(editor.state.get().doc).toBe(doc)
  })
  it("reorders auto-layout children, moves across parents, and rejects cycles", () => {
    const editor = setup()
    const [a] = editor.insert("box")
    const [b] = editor.insert("box", framesOf(editor.state.get().doc)[0].id)
    const [x] = editor.insert("text", a)
    const [y] = editor.insert("text", a)
    editor.moveNodes([y], a, "children", 0)
    expect(findNode(framesOf(editor.state.get().doc), y)?.parent?.id).toBe(a)
    editor.moveNodes([x], b)
    expect(findNode(framesOf(editor.state.get().doc), x)?.parent?.id).toBe(b)
    const before = editor.state.get().doc
    editor.moveNodes([b], x)
    expect(editor.state.get().doc).toBe(before)
    validateDocument(editor.state.get().doc, library)
  })
  it("groups and ungroups siblings without corrupting Immer references", () => {
    const editor = setup()
    const frame = framesOf(editor.state.get().doc)[0]
    const [a] = editor.insert("text", frame.id)
    const [b] = editor.insert("DigiButton", frame.id)
    editor.set({ selectedIds: [a, b] })
    editor.group()
    const group = findNode(
      framesOf(editor.state.get().doc),
      editor.state.get().selectedIds[0]
    )!.node
    expect(group.type).toBe("box")
    expect(() => JSON.stringify(editor.state.get().doc)).not.toThrow()
    editor.ungroup()
    expect(framesOf(editor.state.get().doc)[0].children).toHaveLength(2)
    editor.undo()
    expect(framesOf(editor.state.get().doc)[0].children).toHaveLength(1)
  })
  it("inserts valid composed recipes and declared template slots", () => {
    const editor = setup()
    for (const name of [
      "DigiButton",
      "DigiBadge",
      "DigiAlert",
      "DigiAccordion",
      "DigiTable",
      "EventLayout",
    ]) {
      expect(
        editor.insert(name, framesOf(editor.state.get().doc)[0].id),
        name
      ).toHaveLength(1)
      expect(
        () => validateDocument(editor.state.get().doc, library),
        name
      ).not.toThrow()
    }
  })
  it("only exposes insertable library entries with valid initial props", () => {
    const invalid: string[] = []
    for (const entry of libraryEntries.filter(
      (item) => !insertionIssue(item)
    )) {
      if (!setup().insert(entry.name).length) invalid.push(entry.name)
    }
    expect(invalid).toEqual([])
  })
  it("preserves pointer world position across zoom and resolves deep selection independently of zoom", () => {
    const editor = setup()
    editor.setViewport({ x: 30, y: 20, zoom: 0.5 })
    editor.zoomAt({ x: 300, y: 200 }, 2)
    expect(editor.state.get().viewport).toEqual({ x: -240, y: -160, zoom: 1 })
    const frame = framesOf(editor.state.get().doc)[0],
      [box] = editor.insert("box"),
      [text] = editor.insert("text", box)
    editor.set({
      layouts: {
        [frame.id]: {
          rects: {
            [box]: { x: 40, y: 40, width: 320, height: 120 },
            [text]: { x: 64, y: 64, width: 100, height: 24 },
          },
          computed: {},
          contentHeight: 900,
        },
      },
    })
    for (const zoom of [0.05, 0.5, 1, 4]) {
      editor.setViewport({ x: 0, y: 0, zoom })
      expect(hitTest(editor.state.get(), { x: 70, y: 70 })).toBe(box)
      expect(hitTest(editor.state.get(), { x: 70, y: 70 }, true)).toBe(text)
    }
  })
})
