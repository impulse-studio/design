import { expect, it } from "vitest"
import { findNode, validateDocument } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { resizeDimension, setPositioning } from "./dimensions"
import { library } from "./library"

const setup = () =>
  createEditor({ name: "Dimensions", status: "draft", doc: emptyDocument() })
it("keeps each layer’s own ratio in a mixed-size selection and persists it through document validation", () => {
  const editor = setup()
  const first = framesOf(editor.state.get().doc)[0].id
  const second = editor.addFrame("mobile")!
  editor.updateNodes([first], (node) => {
    if (node.type === "frame") {
      node.width = 400
      node.height = 200
      node.lockAspectRatio = true
    }
  })
  editor.updateNodes([second], (node) => {
    if (node.type === "frame") {
      node.width = 200
      node.height = 400
      node.lockAspectRatio = true
    }
  })
  editor.set({ selectedIds: [first, second] })
  const before = editor.state.get().doc
  resizeDimension(editor, "width", 600)
  expect(
    framesOf(editor.state.get().doc).map(({ width, height }) => ({
      width,
      height,
    }))
  ).toEqual([
    { width: 600, height: 300 },
    { width: 600, height: 1200 },
  ])
  expect(
    validateDocument(editor.state.get().doc, library).pages[0].frames.every(
      (frame) => frame.lockAspectRatio
    )
  ).toBe(true)
  editor.undo()
  expect(editor.state.get().doc).toBe(before)
})
it("uses measured hug dimensions when locking a layer to fixed dimensions", () => {
  const editor = setup(),
    frame = framesOf(editor.state.get().doc)[0]
  const [id] = editor.insert("text")
  editor.updateNodes([id], (node) => {
    node.lockAspectRatio = true
  })
  editor.set({
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: { [id]: { x: 40, y: 40, width: 100, height: 25 } },
      },
    },
  })
  resizeDimension(editor, "height", 50)
  expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
    layout: {
      width: { mode: "fixed", value: 200 },
      height: { mode: "fixed", value: 50 },
    },
  })
})
it("preserves the measured position when removing a child from auto layout", () => {
  const editor = setup(),
    frame = framesOf(editor.state.get().doc)[0]
  const [box] = editor.insert("box"),
    [child] = editor.insert("text", box)
  editor.set({
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: {
          [box]: { x: 100, y: 80, width: 400, height: 200 },
          [child]: { x: 124, y: 112, width: 100, height: 25 },
        },
      },
    },
  })
  setPositioning(editor, "absolute")
  expect(findNode(framesOf(editor.state.get().doc), child)?.node).toMatchObject(
    { layout: { position: { x: 24, y: 32 } } }
  )
  const before = editor.state.get().doc
  setPositioning(editor, "absolute")
  expect(editor.state.get().doc).toBe(before)
  setPositioning(editor, "flow")
  expect(findNode(framesOf(editor.state.get().doc), child)?.node).toMatchObject(
    { layout: { position: "flow" } }
  )
})
