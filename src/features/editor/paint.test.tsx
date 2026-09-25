import { render, fireEvent } from "@testing-library/react"
import { expect, it } from "vitest"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { PaintSection } from "@/pages/editor/components/inspector/sections/PaintSection"

it("shows mixed paint values and changes opacity without flattening distinct colors", () => {
  const editor = createEditor({
    name: "Couleurs",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [red] = editor.insert("text", frame.id),
    [blue] = editor.insert("text", frame.id)
  editor.updateNodes([red], (node) => {
    node.style = { background: "#FF0000" }
  })
  editor.updateNodes([blue], (node) => {
    node.style = { background: "#0000FF" }
  })
  editor.set({ selectedIds: [red, blue] })
  const previous = editor.state.get().doc,
    past = editor.state.get().past.length
  const view = render(
    <EditorProvider editor={editor}>
      <PaintSection kind="fill" />
    </EditorProvider>
  )
  expect(view.getByText("Mixte")).toBeTruthy()
  const opacity = view.getByRole("spinbutton", {
    name: "Couleur de fond opacité",
  })
  fireEvent.focus(opacity)
  fireEvent.change(opacity, { target: { value: "30" } })
  fireEvent.change(opacity, { target: { value: "50" } })
  fireEvent.blur(opacity)
  expect(
    framesOf(editor.state.get().doc)[0].children.map(
      (node) => node.style?.background
    )
  ).toEqual(["#FF000080", "#0000FF80"])
  expect(editor.state.get().past).toHaveLength(past + 1)
  editor.undo()
  expect(editor.state.get().doc).toBe(previous)
})

it("removes a fill without restoring the inherited color, and adds it back explicitly", () => {
  const editor = createEditor({
    name: "Fond",
    status: "draft",
    doc: emptyDocument(),
  })
  editor.select(framesOf(editor.state.get().doc)[0].id)
  const view = render(
    <EditorProvider editor={editor}>
      <PaintSection kind="fill" />
    </EditorProvider>
  )
  fireEvent.click(view.getByRole("button", { name: "Supprimer le fond" }))
  expect(framesOf(editor.state.get().doc)[0].style).toMatchObject({
    backgroundVisible: false,
  })
  expect(view.queryByLabelText("Couleur de fond HEX")).toBeNull()
  fireEvent.click(view.getByRole("button", { name: "Ajouter un fond" }))
  expect(framesOf(editor.state.get().doc)[0].style).toMatchObject({
    background: "#FFFFFF",
    backgroundVisible: true,
  })
})
