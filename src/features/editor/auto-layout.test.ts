import { expect, it } from "vitest"
import {
  findNode,
  validateDocument,
  autoLayoutStyle,
} from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { addAutoLayoutToSelection, setAutoLayout } from "./auto-layout"
import { setPositioning } from "./dimensions"
import { nodeRect } from "./geometry"
import { library } from "./library"

const setup = () =>
  createEditor({ name: "Auto layout", status: "draft", doc: emptyDocument() })

it("converts existing frame children to flow and preserves measured positions when returning to freeform", () => {
  const editor = setup()
  const frame = framesOf(editor.state.get().doc)[0]
  const [first] = editor.insert("text", frame.id)
  const [second] = editor.insert("text", frame.id)
  editor.set({
    layouts: {
      [frame.id]: {
        contentWidth: 400,
        contentHeight: 300,
        rects: {
          [first]: { x: 10, y: 20, width: 60, height: 20 },
          [second]: { x: 10, y: 50, width: 60, height: 20 },
        },
      },
    },
  })
  editor.select(frame.id)
  setAutoLayout(editor, "column")
  expect(framesOf(editor.state.get().doc)[0].autoLayout?.direction).toBe(
    "column"
  )
  expect(
    framesOf(editor.state.get().doc)[0].children.map(
      (child) => child.layout?.position
    )
  ).toEqual(["flow", "flow"])
  setAutoLayout(editor, "grid")
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toMatchObject({
    direction: "grid",
    gridColumns: 2,
  })
  setAutoLayout(editor, null)
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toBeUndefined()
  expect(
    findNode(framesOf(editor.state.get().doc), second)?.node
  ).toMatchObject({ layout: { position: { x: 10, y: 50 } } })
  expect(
    validateDocument(editor.state.get().doc, library).pages[0].frames[0]
      .autoLayout
  ).toBeUndefined()
  editor.undo()
  expect(framesOf(editor.state.get().doc)[0].autoLayout?.direction).toBe("grid")
  editor.redo()
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toBeUndefined()
})

it("inserts children into frame flow and lets one child ignore auto layout", () => {
  const editor = setup()
  const frame = framesOf(editor.state.get().doc)[0]
  editor.select(frame.id)
  setAutoLayout(editor, "row")
  const [child] = editor.insert("text", frame.id)
  expect(findNode(framesOf(editor.state.get().doc), child)?.node).toMatchObject(
    { layout: { position: "flow" } }
  )
  editor.set({
    layouts: {
      [frame.id]: {
        contentWidth: frame.width as number,
        contentHeight: frame.height as number,
        rects: { [child]: { x: 70, y: 45, width: 60, height: 20 } },
      },
    },
  })
  editor.select(child)
  setPositioning(editor, "absolute")
  expect(findNode(framesOf(editor.state.get().doc), child)?.node).toMatchObject(
    { layout: { position: { x: 70, y: 45 } } }
  )
  setPositioning(editor, "flow")
  expect(findNode(framesOf(editor.state.get().doc), child)?.node).toMatchObject(
    { layout: { position: "flow" } }
  )
})

it("renders a grid with separate gaps and the three auto spacing distributions", () => {
  expect(
    autoLayoutStyle({ direction: "grid", gridColumns: 3, gap: 8, crossGap: 12 })
  ).toMatchObject({
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "8px",
    rowGap: "12px",
  })
  for (const [justify, css] of [
    ["between", "space-between"],
    ["around", "space-around"],
    ["evenly", "space-evenly"],
  ] as const)
    expect(
      autoLayoutStyle({ direction: "row", gap: "auto", justify }).justifyContent
    ).toBe(css)
})

it("uses measured Hug width and respects frame minimum and maximum", () => {
  const editor = setup()
  const frame = framesOf(editor.state.get().doc)[0]
  editor.select(frame.id)
  setAutoLayout(editor, "column")
  editor.updateSelection((node) => {
    if (node.type === "frame") {
      node.width = "hug"
      node.minW = 200
      node.maxW = 500
    }
  })
  editor.set({
    layouts: {
      [frame.id]: { contentWidth: 360, contentHeight: 100, rects: {} },
    },
  })
  expect(
    nodeRect(editor.state.get(), framesOf(editor.state.get().doc)[0])?.width
  ).toBe(360)
  editor.set({
    layouts: {
      [frame.id]: { contentWidth: 80, contentHeight: 100, rects: {} },
    },
  })
  expect(
    nodeRect(editor.state.get(), framesOf(editor.state.get().doc)[0])?.width
  ).toBe(200)
  editor.set({
    layouts: {
      [frame.id]: { contentWidth: 800, contentHeight: 100, rects: {} },
    },
  })
  expect(
    nodeRect(editor.state.get(), framesOf(editor.state.get().doc)[0])?.width
  ).toBe(500)
  expect(
    validateDocument(editor.state.get().doc, library).pages[0].frames[0].width
  ).toBe("hug")
})

it("accepts an existing document without auto layout fields", () => {
  const document = emptyDocument()
  expect(
    validateDocument(document, library).pages[0].frames[0].autoLayout
  ).toBeUndefined()
})

it("wraps selected siblings in one auto layout frame and restores them with undo", () => {
  const editor = setup()
  const frame = framesOf(editor.state.get().doc)[0]
  const [first] = editor.insert("box", frame.id)
  const [second] = editor.insert("box", frame.id)
  editor.set({
    layouts: {
      [frame.id]: {
        contentWidth: 440,
        contentHeight: 340,
        rects: {
          [first]: { x: 42, y: 66, width: 320, height: 48 },
          [second]: { x: 42, y: 126, width: 320, height: 48 },
        },
      },
    },
  })
  editor.select(second)
  editor.select(first, true)
  addAutoLayoutToSelection(editor)
  const wrapped = framesOf(editor.state.get().doc)[0].children[0]
  expect(wrapped.type).toBe("box")
  if (wrapped.type !== "box") return
  expect(wrapped.name).toBe("Frame auto layout")
  expect(wrapped.style).toEqual({})
  expect(wrapped.autoLayout).toMatchObject({
    direction: "column",
    gap: 12,
    padding: [0, 0, 0, 0],
  })
  expect(wrapped.layout?.position).toEqual({ x: 42, y: 66 })
  expect(wrapped.children.map((child) => child.id)).toEqual([first, second])
  expect(wrapped.children.map((child) => child.layout?.position)).toEqual([
    "flow",
    "flow",
  ])
  expect(editor.state.get().selectedIds).toEqual([wrapped.id])
  expect(framesOf(editor.state.get().doc)[0].children).toHaveLength(1)
  editor.undo()
  expect(framesOf(editor.state.get().doc)[0].children).toHaveLength(2)
})
