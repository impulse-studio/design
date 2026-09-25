import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { LayoutSection } from "@/pages/editor/components/inspector/sections/LayoutSection"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"

it("creates one auto layout frame from a multiple selection in the inspector", () => {
  const editor = createEditor({
    name: "Inspector",
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
      <LayoutSection />
    </EditorProvider>
  )
  expect(
    screen.getByText(/placer la sélection dans une frame auto layout/)
  ).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Horizontal" }))
  const children = framesOf(editor.state.get().doc)[0].children
  expect(children).toHaveLength(1)
  expect(children[0]).toMatchObject({
    type: "box",
    autoLayout: { direction: "row" },
    children: [{ id: first }, { id: second }],
  })
  expect(editor.state.get().selectedIds).toEqual([children[0].id])
})
