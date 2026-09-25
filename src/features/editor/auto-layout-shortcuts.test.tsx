import { fireEvent, render } from "@testing-library/react"
import { expect, it } from "vitest"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { useShortcuts } from "./use-shortcuts"

const fit = () => undefined
const zoomTo = () => undefined
const ShortcutHarness = () => {
  useShortcuts(fit, zoomTo)
  return <input aria-label="Saisie" />
}

it("adds and removes auto layout with Figma shortcuts, but ignores typing in a field", () => {
  const editor = createEditor({
    name: "Shortcuts",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  editor.select(frame.id)
  const view = render(
    <EditorProvider editor={editor}>
      <ShortcutHarness />
    </EditorProvider>
  )
  fireEvent.keyDown(window, { key: "A", shiftKey: true })
  expect(framesOf(editor.state.get().doc)[0].autoLayout?.direction).toBe(
    "column"
  )
  fireEvent.keyDown(window, { key: "A", shiftKey: true, altKey: true })
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toBeUndefined()
  fireEvent.keyDown(view.getByRole("textbox", { name: "Saisie" }), {
    key: "A",
    shiftKey: true,
  })
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toBeUndefined()
})

it("wraps a multiple selection in a single auto layout frame with Shift+A", () => {
  const editor = createEditor({
    name: "Shortcuts",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [first] = editor.insert("box", frame.id)
  const [second] = editor.insert("box", frame.id)
  editor.select(first)
  editor.select(second, true)
  render(
    <EditorProvider editor={editor}>
      <ShortcutHarness />
    </EditorProvider>
  )
  fireEvent.keyDown(window, { key: "A", shiftKey: true })
  const children = framesOf(editor.state.get().doc)[0].children
  expect(children).toHaveLength(1)
  expect(children[0]).toMatchObject({
    type: "box",
    autoLayout: { direction: "column" },
    children: [{ id: first }, { id: second }],
  })
  expect(editor.state.get().selectedIds).toEqual([children[0].id])
})
