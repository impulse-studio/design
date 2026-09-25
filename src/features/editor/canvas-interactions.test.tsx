import { useRef } from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { findNode } from "@digit-ai-studio/shared"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { CanvasWorld } from "@/pages/editor/components/canvas/CanvasWorld"
import { SelectionOverlay } from "@/pages/editor/components/canvas/SelectionOverlay"
import { useCanvasGestures } from "./use-canvas-gestures"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { useSelection } from "./use-selection"
import { sameFrameContent } from "./use-frame-renderer"

const frameTick = async () => {
  await act(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  )
}
const Surface = () => {
  const surface = useRef<HTMLDivElement>(null)
  useCanvasGestures(surface)
  return (
    <div ref={surface} data-testid="surface" tabIndex={0}>
      <CanvasWorld />
      <SelectionOverlay />
    </div>
  )
}
const InspectorProbe = ({ rendered }: { rendered: () => void }) => {
  useSelection()
  rendered()
  return null
}
const setup = () => {
  const editor = createEditor({
    name: "Gestes",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [id] = editor.insert("text", frame.id, undefined, { x: 40, y: 40 })
  editor.setViewport({ x: 0, y: 0, zoom: 1 })
  editor.set({
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: { [id]: { x: 40, y: 40, width: 100, height: 40 } },
      },
    },
  })
  const rendered = vi.fn()
  const view = render(
    <EditorProvider editor={editor}>
      <Surface />
      <InspectorProbe rendered={rendered} />
    </EditorProvider>
  )
  const surface = screen.getByTestId("surface")
  const pointer = (
    type: string,
    x: number,
    y: number,
    extra: PointerEventInit = {},
    target: Element = surface
  ) => {
    act(() =>
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: "mouse",
          button: 0,
          buttons: type === "pointerup" ? 0 : 1,
          clientX: x,
          clientY: y,
          ...extra,
        })
      )
    )
  }
  return { editor, id, frame, pointer, surface, rendered, view }
}

afterEach(() => vi.useRealTimers())

describe("native @use-gesture interaction lifecycle", () => {
  it("previews a drag without editing the document or rerendering the inspector; release commits the last position once", async () => {
    const { editor, id, pointer, rendered } = setup()
    const before = editor.state.get().doc,
      past = editor.state.get().past.length
    pointer("pointerdown", 60, 55)
    rendered.mockClear()
    pointer("pointermove", 200, 150)
    await frameTick()
    expect(editor.canvas.visual.get().preview?.rects[id]).toMatchObject({
      x: 180,
      y: 135,
    })
    expect(editor.state.get().doc).toBe(before)
    expect(rendered).not.toHaveBeenCalled()
    pointer("pointerup", 260, 155)
    expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
      layout: { position: { x: 240, y: 140 } },
    })
    expect(editor.state.get().past).toHaveLength(past + 1)
    act(() => editor.undo())
    expect(editor.state.get().doc).toBe(before)
    act(() => editor.redo())
    expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
      layout: { position: { x: 240, y: 140 } },
    })
  })
  it.each(["pointercancel", "lostpointercapture", "blur", "Escape"])(
    "rolls back %s and discards queued pointer movement",
    async (reason) => {
      const { editor, pointer, surface } = setup()
      const before = editor.state.get().doc,
        past = editor.state.get().past.length
      pointer("pointerdown", 60, 55)
      pointer("pointermove", 200, 150)
      act(() => {
        if (reason === "blur") window.dispatchEvent(new Event("blur"))
        else if (reason === "Escape")
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", cancelable: true })
          )
        else
          surface.dispatchEvent(
            new PointerEvent(reason, { bubbles: true, pointerId: 1 })
          )
      })
      await frameTick()
      pointer("pointerup", 260, 155)
      expect(editor.state.get().doc).toBe(before)
      expect(editor.state.get().past).toHaveLength(past)
      expect(editor.state.get().transaction).toBeNull()
      expect(editor.canvas.visual.get().preview).toBeNull()
    }
  )
  it("cancels a pending gesture on unmount", () => {
    const { editor, pointer, view } = setup()
    const before = editor.state.get().doc
    pointer("pointerdown", 60, 55)
    pointer("pointermove", 200, 100)
    view.unmount()
    expect(editor.state.get().doc).toBe(before)
    expect(editor.state.get().transaction).toBeNull()
    expect(editor.canvas.visual.get().preview).toBeNull()
  })
  it("duplicates only in the temporary document and commits a single undo step", async () => {
    const { editor, id, pointer } = setup()
    const before = editor.state.get().doc,
      past = editor.state.get().past.length
    pointer("pointerdown", 60, 55, { altKey: true })
    pointer("pointermove", 260, 155, { altKey: true })
    await frameTick()
    expect(editor.state.get().doc).toBe(before)
    expect(framesOf(editor.canvas.draft.get()!.doc)[0].children).toHaveLength(2)
    pointer("pointerup", 260, 155, { altKey: true })
    expect(editor.state.get().selectedIds[0]).not.toBe(id)
    expect(editor.state.get().past).toHaveLength(past + 1)
    act(() => editor.undo())
    expect(editor.state.get().doc).toBe(before)
  })
  it("resizes through a real handle, including Shift+Alt", async () => {
    const { editor, id, pointer } = setup()
    const before = editor.state.get().doc
    pointer(
      "pointerdown",
      140,
      80,
      {},
      screen.getByRole("button", { name: "Redimensionner se" })
    )
    pointer("pointermove", 165, 90, { shiftKey: true, altKey: true })
    await frameTick()
    expect(editor.state.get().doc).toBe(before)
    expect(editor.canvas.visual.get().preview?.rects[id]).toMatchObject({
      x: 15,
      y: 30,
      width: 150,
      height: 60,
    })
    pointer("pointerup", 165, 90, { shiftKey: true, altKey: true })
    expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
      layout: { width: { mode: "fixed", value: 150 } },
    })
  })
  it("does not create an undo entry for a click or modify nodes in inspect mode", () => {
    const { editor, pointer } = setup()
    const before = editor.state.get().doc,
      past = editor.state.get().past.length
    pointer("pointerdown", 60, 55)
    pointer("pointerup", 60, 55)
    expect(editor.state.get().past).toHaveLength(past)
    act(() => editor.setEditorMode("inspect"))
    pointer("pointerdown", 60, 55)
    pointer("pointerup", 260, 155)
    expect(editor.state.get().doc).toBe(before)
  })
  it("pans by the middle button and restores the initial viewport on cancellation", async () => {
    const { editor, pointer } = setup()
    pointer("pointerdown", 60, 55, { button: 1, buttons: 4 })
    pointer("pointermove", 160, 155, { button: 1, buttons: 4 })
    await frameTick()
    expect(editor.canvas.viewport.get()).toEqual({ x: 100, y: 100, zoom: 1 })
    expect(editor.state.get().viewport).toEqual({ x: 0, y: 0, zoom: 1 })
    act(() =>
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", cancelable: true })
      )
    )
    expect(editor.canvas.viewport.get()).toEqual({ x: 0, y: 0, zoom: 1 })
  })
  it("zooms at the wheel pointer without also panning or rendering the inspector", async () => {
    const { editor, surface, rendered } = setup()
    rendered.mockClear()
    fireEvent.wheel(surface, {
      clientX: 200,
      clientY: 100,
      deltaY: -30,
      ctrlKey: true,
    })
    await frameTick()
    const viewport = editor.canvas.viewport.get()
    expect(viewport.zoom).toBeGreaterThan(1)
    expect((200 - viewport.x) / viewport.zoom).toBeCloseTo(200)
    expect((100 - viewport.y) / viewport.zoom).toBeCloseTo(100)
    expect(rendered).not.toHaveBeenCalled()
  })
})

it("does not replace iframe contents when only a frame position changes", () => {
  const { editor, frame } = setup()
  const original = framesOf(editor.state.get().doc)[0]
  act(() =>
    editor.updateNodes([frame.id], (node) => {
      if (node.type === "frame") node.x += 100
    })
  )
  expect(sameFrameContent(original, framesOf(editor.state.get().doc)[0])).toBe(
    true
  )
})
