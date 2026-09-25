import { createElement } from "react"
import type { ReactNode } from "react"
import { act, fireEvent, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { EditorContext } from "./context"
import { useShortcuts } from "./use-shortcuts"

const setup = () => {
  const editor = createEditor({
    name: "Clavier",
    status: "draft",
    doc: emptyDocument(),
  })
  editor.select(framesOf(editor.state.get().doc)[0].id)
  const fit = vi.fn(),
    zoom = vi.fn()
  renderHook(() => useShortcuts(fit, zoom), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(EditorContext.Provider, { value: editor }, children),
  })
  return { editor, fit, zoom }
}
it("does not nudge layers while a slider or tree control receives arrow keys", () => {
  const { editor } = setup(),
    before = editor.state.get().doc
  for (const role of [
    "slider",
    "spinbutton",
    "combobox",
    "treeitem",
    "button",
  ]) {
    const control = document.createElement(role === "button" ? "button" : "div")
    control.setAttribute("role", role)
    document.body.append(control)
    fireEvent.keyDown(control, { key: "ArrowRight" })
    expect(editor.state.get().doc).toBe(before)
    control.remove()
  }
  fireEvent.keyDown(window, { key: "ArrowRight", shiftKey: true })
  expect(framesOf(editor.state.get().doc)[0].x).toBe(10)
})
it("switches modes once per key press and leaves inspect selection intact under editing shortcuts", () => {
  const { editor } = setup(),
    before = editor.state.get().doc,
    selection = editor.state.get().selectedIds
  fireEvent.keyDown(window, { key: "D", shiftKey: true })
  fireEvent.keyDown(window, { key: "D", shiftKey: true, repeat: true })
  expect(editor.state.get().rightTab).toBe("inspect")
  for (const key of ["Delete", "ArrowRight", "r", "f", "t"])
    fireEvent.keyDown(window, { key })
  fireEvent.keyDown(window, { key: "z", metaKey: true })
  expect(editor.state.get().doc).toBe(before)
  expect(editor.state.get().selectedIds).toEqual(selection)
  expect(editor.state.get().tool).toBe("move")
  fireEvent.keyDown(window, { key: "h" })
  expect(editor.state.get().tool).toBe("hand")
  fireEvent.keyDown(window, { key: "D", shiftKey: true })
  expect(editor.state.get().rightTab).toBe("design")
})
it("keeps zoom shortcuts available in Dev Mode and resets around the viewport center", () => {
  const { editor, zoom, fit } = setup()
  act(() => editor.setEditorMode("inspect"))
  fireEvent.keyDown(window, { key: "+" })
  fireEvent.keyDown(window, { key: ")", code: "Digit0", shiftKey: true })
  expect(zoom.mock.calls).toEqual([[0.625], [1]])
  fireEvent.keyDown(window, { code: "Digit2", shiftKey: true })
  expect(fit).toHaveBeenCalledWith(true)
})
it("ignores composition and already handled events", () => {
  const { editor } = setup(),
    before = editor.state.get().doc
  fireEvent.keyDown(window, { key: "Delete", isComposing: true })
  const event = new KeyboardEvent("keydown", {
    key: "Delete",
    cancelable: true,
  })
  event.preventDefault()
  window.dispatchEvent(event)
  expect(editor.state.get().doc).toBe(before)
})

it("groups a held arrow key into one undo and cancels it with Escape", () => {
  const { editor } = setup(),
    before = editor.state.get().doc
  fireEvent.keyDown(window, { key: "ArrowRight" })
  fireEvent.keyDown(window, { key: "ArrowRight", repeat: true })
  fireEvent.keyDown(window, { key: "ArrowRight", repeat: true })
  fireEvent.keyUp(window, { key: "ArrowRight" })
  expect(framesOf(editor.state.get().doc)[0].x).toBe(3)
  expect(editor.state.get().past).toHaveLength(1)
  act(() => editor.undo())
  expect(editor.state.get().doc).toBe(before)
  fireEvent.keyDown(window, { key: "ArrowRight" })
  fireEvent.keyDown(window, { key: "Escape" })
  fireEvent.keyUp(window, { key: "ArrowRight" })
  expect(editor.state.get().doc).toBe(before)
  expect(editor.state.get().future).toHaveLength(1)
})

it("reopens the library when its insertion shortcut is used", () => {
  const { editor } = setup()
  act(() => editor.set({ libraryVisible: false, tab: "layers" }))
  fireEvent.keyDown(window, { key: "i" })
  expect(editor.state.get()).toMatchObject({
    libraryVisible: true,
    tab: "components",
  })
})
