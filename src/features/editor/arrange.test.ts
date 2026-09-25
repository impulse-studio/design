import { expect, it } from "vitest"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { alignSelection, distributeSelection, orderSelection } from "./arrange"

it("aligns and distributes frames as single reversible actions", () => {
  const editor = createEditor({
    name: "Test",
    status: "draft",
    doc: emptyDocument(),
  })
  editor.addFrame("desktop", { x: 1600, y: 100 })
  editor.addFrame("desktop", { x: 3400, y: 50 })
  editor.set({
    selectedIds: framesOf(editor.state.get().doc).map((frame) => frame.id),
  })
  alignSelection(editor, "top")
  expect(framesOf(editor.state.get().doc).map((frame) => frame.y)).toEqual([
    0, 0, 0,
  ])
  editor.undo()
  expect(framesOf(editor.state.get().doc).map((frame) => frame.y)).toEqual([
    0, 100, 50,
  ])
  distributeSelection(editor, "x")
  expect(framesOf(editor.state.get().doc).map((frame) => frame.x)).toEqual([
    0, 1700, 3400,
  ])
  editor.undo()
  expect(framesOf(editor.state.get().doc).map((frame) => frame.x)).toEqual([
    0, 1600, 3400,
  ])
  const first = framesOf(editor.state.get().doc)[0].id
  editor.select(first)
  orderSelection(editor, "front")
  expect(framesOf(editor.state.get().doc).at(-1)!.id).toBe(first)
})
it("undoes the lifecycle status with the editor metadata", () => {
  const editor = createEditor({
    name: "Test",
    status: "draft",
    doc: emptyDocument(),
  })
  editor.setStatus("in_review")
  expect(editor.state.get().status).toBe("in_review")
  editor.undo()
  expect(editor.state.get().status).toBe("draft")
  editor.redo()
  expect(editor.state.get().status).toBe("in_review")
})

it("aligns a selection as a group to its parent when Shift is held", () => {
  const editor = createEditor({
    name: "Alignement",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [a] = editor.insert("text", frame.id, undefined, { x: 100, y: 40 })
  const [b] = editor.insert("text", frame.id, undefined, { x: 300, y: 60 })
  editor.set({
    selectedIds: [a, b],
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: {
          [a]: { x: 100, y: 40, width: 100, height: 20 },
          [b]: { x: 300, y: 60, width: 100, height: 20 },
        },
      },
    },
  })
  const before = editor.state.get().doc
  alignSelection(editor, "left", true)
  expect(
    framesOf(editor.state.get().doc)[0].children.map(
      (node) => node.layout?.position
    )
  ).toEqual([
    { x: 0, y: 40 },
    { x: 200, y: 60 },
  ])
  editor.undo()
  expect(editor.state.get().doc).toBe(before)
})
