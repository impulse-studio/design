import { expect, it } from "vitest"
import { findNode } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { hitTest } from "./geometry"
import { orderSelection } from "./arrange"

it("selects the frontmost subtree even when an obscured subtree is deeper", () => {
  const editor = createEditor({
    name: "Test",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [back] = editor.insert("box", frame.id),
    [deep] = editor.insert("text", back),
    [front] = editor.insert("DigiButton", frame.id)
  editor.set({
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: Object.fromEntries(
          [back, deep, front].map((id) => [
            id,
            { x: 40, y: 40, width: 100, height: 40 },
          ])
        ),
      },
    },
  })
  expect(hitTest(editor.state.get(), { x: 60, y: 60 }, true)).toBe(front)
  editor.select(front)
  orderSelection(editor, "back")
  expect(hitTest(editor.state.get(), { x: 60, y: 60 }, true)).toBe(deep)
  expect(hitTest(editor.state.get(), { x: 60, y: 60 })).toBe(back)
  editor.undo()
  expect(hitTest(editor.state.get(), { x: 60, y: 60 }, true)).toBe(front)
})

it("preserves world position when reparenting into another frame", () => {
  const editor = createEditor({
    name: "Test",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0],
    [id] = editor.insert("text", frame.id, undefined, { x: 100, y: 80 })
  const destination = editor.addFrame("mobile", { x: 80, y: 50 })!
  editor.moveNodes([id], destination)
  const moved = findNode(framesOf(editor.state.get().doc), id)!
  expect(moved.frame.id).toBe(destination)
  expect(moved.node).toMatchObject({ layout: { position: { x: 20, y: 30 } } })
  editor.undo()
  expect(findNode(framesOf(editor.state.get().doc), id)?.frame.id).toBe(
    frame.id
  )
})
