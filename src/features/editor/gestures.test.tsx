import { createElement } from "react"
import type { PointerEvent, ReactNode } from "react"
import { act, renderHook } from "@testing-library/react"
import { expect, it } from "vitest"
import { findNode, selfLayoutStyle } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { EditorContext } from "./context"
import { useCanvasGestures } from "./use-canvas-gestures"

const setup = () => {
  const editor = createEditor({
    name: "Test",
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
  const surface = document.createElement("div")
  document.body.append(surface)
  const hook = renderHook(() => useCanvasGestures({ current: surface }), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(EditorContext.Provider, { value: editor }, children),
  })
  const pointer = (
    x: number,
    y: number,
    modifiers: { altKey?: boolean; shiftKey?: boolean } = {}
  ) =>
    ({
      button: 0,
      clientX: x,
      clientY: y,
      currentTarget: surface,
      target: surface,
      pointerId: 1,
      preventDefault: () => {},
      stopPropagation: () => {},
      ...modifiers,
    }) as unknown as PointerEvent<HTMLDivElement>
  return { editor, id, frame, hook, pointer, surface }
}

it("duplicates on Alt-drag only after movement and restores it with one undo", () => {
  const { editor, id, frame, hook, pointer, surface } = setup()
  const original = editor.state.get().doc,
    past = editor.state.get().past.length
  act(() => hook.result.current.down(pointer(60, 55, { altKey: true })))
  act(() => hook.result.current.move(pointer(62, 56, { altKey: true })))
  expect(framesOf(editor.state.get().doc)[0].children).toHaveLength(1)
  act(() => hook.result.current.move(pointer(260, 155, { altKey: true })))
  act(() => hook.result.current.up(pointer(260, 155, { altKey: true })))
  const clone = editor.state.get().selectedIds[0]
  expect(clone).not.toBe(id)
  expect(findNode(framesOf(editor.state.get().doc), clone)?.node).toMatchObject(
    { layout: { position: { x: 240, y: 140 } } }
  )
  expect(framesOf(editor.state.get().doc)[0].id).toBe(frame.id)
  expect(editor.state.get().past).toHaveLength(past + 1)
  editor.undo()
  expect(editor.state.get().doc).toBe(original)
  surface.remove()
})

it("resizes proportionally from the center with Shift+Alt in one transaction", () => {
  const { editor, id, hook, pointer, surface } = setup()
  const past = editor.state.get().past.length
  act(() => hook.result.current.startResize(pointer(140, 80), "se"))
  act(() =>
    hook.result.current.move(pointer(165, 90, { shiftKey: true, altKey: true }))
  )
  act(() =>
    hook.result.current.up(pointer(165, 90, { shiftKey: true, altKey: true }))
  )
  expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
    layout: {
      position: { x: 15, y: 30 },
      width: { mode: "fixed", value: 150 },
      height: { mode: "fixed", value: 60 },
    },
  })
  expect(editor.state.get().past).toHaveLength(past + 1)
  surface.remove()
})

it("emits explicit CSS units so Vue renders position and constraints", () => {
  expect(
    selfLayoutStyle(
      { position: { x: 60, y: 40 }, minW: 20, maxH: 300 },
      "column"
    )
  ).toMatchObject({
    left: "60px",
    top: "40px",
    minWidth: "20px",
    maxHeight: "300px",
  })
})

it("inspects locked layers in Dev Mode without dragging, duplicating or resizing them", () => {
  const { editor, id, hook, pointer, surface } = setup()
  editor.updateNodes([id], (node) => {
    node.locked = true
  })
  editor.setEditorMode("inspect")
  editor.select(null)
  const before = editor.state.get().doc
  act(() => hook.result.current.down(pointer(60, 55, { altKey: true })))
  act(() => hook.result.current.move(pointer(260, 155, { altKey: true })))
  act(() => hook.result.current.up(pointer(260, 155, { altKey: true })))
  expect(editor.state.get().selectedIds).toEqual([id])
  act(() => hook.result.current.startResize(pointer(140, 80), "se"))
  act(() => hook.result.current.move(pointer(200, 100)))
  act(() => hook.result.current.up(pointer(200, 100)))
  expect(editor.state.get().doc).toBe(before)
  expect(editor.state.get().transaction).toBeNull()
  surface.remove()
})

it("cancels an active drag with Escape and does not resume it on the next pointer move", () => {
  const { editor, hook, pointer, surface } = setup()
  const before = editor.state.get().doc
  act(() => hook.result.current.down(pointer(60, 55)))
  act(() => hook.result.current.move(pointer(260, 155)))
  act(() =>
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", cancelable: true })
    )
  )
  act(() => hook.result.current.move(pointer(300, 200)))
  act(() => hook.result.current.up(pointer(300, 200)))
  expect(editor.state.get().doc).toBe(before)
  expect(editor.state.get().transaction).toBeNull()
  surface.remove()
})
