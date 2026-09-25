import { act, fireEvent, render } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import {
  rendererMessageSchema,
  shellMessageSchema,
} from "@digit-ai-studio/shared"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { CanvasWorld } from "@/pages/editor/components/canvas/CanvasWorld"
import { createGeometryPreview } from "../../../renderer/src/geometry-preview"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"

const tick = async () => {
  await act(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  )
}
const setup = () => {
  const editor = createEditor({
    name: "Bridge",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const view = render(
    <EditorProvider editor={editor}>
      <CanvasWorld />
    </EditorProvider>
  )
  const iframe = view.container.querySelector("iframe")!
  const send = vi.spyOn(iframe.contentWindow!, "postMessage")
  fireEvent.load(iframe)
  const init = shellMessageSchema.parse(send.mock.calls[0][0])
  send.mockClear()
  return { editor, frame, iframe, send, init }
}

it("never reinitializes or replaces an iframe for artboard movement or navigation", async () => {
  const { editor, frame, send } = setup()
  act(() => {
    editor.updateNodes([frame.id], (node) => {
      if (node.type === "frame") {
        node.x += 100
        node.y += 50
      }
    })
    editor.setViewport({ x: 50, y: 30, zoom: 2 })
    editor.canvas.setVisual({
      preview: {
        session: 1,
        frames: {},
        rects: { [frame.id]: { x: 200, y: 100, width: 1440, height: 900 } },
      },
    })
  })
  await tick()
  expect(send).not.toHaveBeenCalled()
})

it("coalesces previews into a single targeted message per frame and clears on cancel", async () => {
  const { editor, frame, send } = setup()
  act(() => {
    for (let width = 500; width <= 550; width++)
      editor.canvas.setVisual({
        preview: {
          session: 1,
          rects: {},
          frames: { [frame.id]: [{ nodeId: frame.id, width }] },
        },
      })
  })
  await tick()
  expect(send).toHaveBeenCalledTimes(1)
  expect(send.mock.calls[0][0]).toMatchObject({
    type: "geometry-preview",
    session: 1,
    sequence: 1,
    patches: [{ nodeId: frame.id, width: 550 }],
  })
  act(() => editor.canvas.reset())
  await tick()
  expect(send.mock.calls[1][0]).toMatchObject({
    type: "geometry-preview",
    session: 1,
    sequence: 2,
    patches: [],
  })
})

it("rejects stale renderer revisions and keeps preview measurements out of the document store", () => {
  const { editor, frame, iframe, init } = setup()
  const original = editor.state.get().layouts
  const message = {
    source: "digit-renderer",
    type: "rendered",
    frameId: frame.id,
    revision: init.revision - 1,
    contentWidth: 100,
    contentHeight: 100,
    rects: {},
  }
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: iframe.contentWindow,
        origin: location.origin,
        data: message,
      })
    )
  )
  expect(editor.state.get().layouts).toBe(original)
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: iframe.contentWindow,
        origin: location.origin,
        data: {
          ...message,
          revision: init.revision,
          previewSession: 1,
          previewSequence: 1,
        },
      })
    )
  )
  expect(editor.state.get().layouts).toBe(original)
})

it("updates hug frame extents transiently and ignores superseded preview measurements", async () => {
  const { editor, frame, iframe, init } = setup()
  const layouts = editor.state.get().layouts
  const preview = (width: number) =>
    editor.canvas.setVisual({
      preview: {
        session: 1,
        rects: {},
        frames: { [frame.id]: [{ nodeId: frame.id, width }] },
      },
    })
  act(() => preview(500))
  await tick()
  const measure = (sequence: number, width: number) =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: iframe.contentWindow,
        origin: location.origin,
        data: {
          source: "digit-renderer",
          type: "rendered",
          frameId: frame.id,
          revision: init.revision,
          previewSession: 1,
          previewSequence: sequence,
          contentWidth: width,
          contentHeight: 200,
          rects: {},
        },
      })
    )
  act(() => measure(1, 500))
  expect(editor.canvas.visual.get().frameSizes[frame.id]?.width).toBe(500)
  expect(editor.state.get().layouts).toBe(layouts)
  act(() => {
    preview(600)
    measure(1, 450)
  })
  expect(editor.canvas.visual.get().frameSizes[frame.id]?.width).toBe(500)
  await tick()
  act(() => measure(2, 600))
  expect(editor.canvas.visual.get().frameSizes[frame.id]?.width).toBe(600)
  act(() => editor.canvas.reset())
  expect(editor.canvas.visual.get().frameSizes).toEqual({})
})

it("applies reversible DOM geometry without replacing the real component", () => {
  const root = document.createElement("div")
  root.innerHTML =
    '<div data-editor-node="text" style="display:contents"><p style="left:10px;top:20px;color:red">Texte</p></div>'
  document.body.append(root)
  const text = root.querySelector("p")!,
    originalStyle = text.getAttribute("style")
  const preview = createGeometryPreview(() => root, "frame")
  preview.apply(1, 1, [
    { nodeId: "text", x: 70, y: 80, width: 150, height: 40 },
  ])
  expect(text.style.left).toBe("70px")
  expect(root.querySelector("p")).toBe(text)
  expect(preview.apply(1, 1, [{ nodeId: "text", x: 2 }])).toBe(false)
  expect(preview.apply(0, 5, [{ nodeId: "text", x: 3 }])).toBe(false)
  preview.apply(1, 2, [])
  expect(text.getAttribute("style")).toBe(originalStyle)
  expect(preview.active).toBe(false)
  expect(preview.apply(1, 1, [{ nodeId: "text", x: 4 }])).toBe(false)
  root.remove()
})

it("rejects malformed preview coordinates and accepts versioned measurements", () => {
  const header = {
    source: "digit-studio",
    type: "geometry-preview",
    frameId: "f",
    revision: 1,
    session: 1,
    sequence: 1,
  }
  expect(
    shellMessageSchema.safeParse({
      ...header,
      patches: [{ nodeId: "n", x: Infinity }],
    }).success
  ).toBe(false)
  expect(
    shellMessageSchema.safeParse({
      ...header,
      patches: [{ nodeId: "n", width: -1 }],
    }).success
  ).toBe(false)
  expect(
    rendererMessageSchema.safeParse({
      source: "digit-renderer",
      type: "rendered",
      frameId: "f",
      revision: 1,
      previewSession: 1,
      previewSequence: 2,
      contentWidth: 100,
      contentHeight: 100,
      rects: {},
    }).success
  ).toBe(true)
})
