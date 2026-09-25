import { StrictMode } from "react"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { InspectorPanel } from "@/pages/editor/components/inspector/InspectorPanel"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"

it("keeps the complete inspector stable while selects are open and the selection changes", async () => {
  const editor = createEditor({
    name: "Stabilité",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [box] = editor.insert("box", frame.id)
  const [text] = editor.insert("text", frame.id)
  const errors = vi.spyOn(console, "error")
  const user = userEvent.setup()
  editor.select(text)
  render(
    <StrictMode>
      <EditorProvider editor={editor}>
        <InspectorPanel fit={() => {}} zoomTo={() => {}} />
      </EditorProvider>
    </StrictMode>
  )
  for (let i = 0; i < 5; i++) {
    await user.click(screen.getByRole("combobox", { name: "Placement" }))
    act(() => {
      editor.set({ hoveredId: box })
      editor.setViewport({ x: i * 10, y: 0, zoom: 1 })
    })
    act(() => editor.select(box))
    expect(screen.queryByRole("listbox")).toBeNull()
    await user.click(
      screen.getByRole("combobox", { name: "Redimensionnement en largeur" })
    )
    act(() => editor.select(text))
    expect(screen.queryByRole("listbox")).toBeNull()
  }
  expect(errors.mock.calls.flat().join(" ")).not.toMatch(
    /maximum update|suspend|not wrapped in act/i
  )
})

it("opens sizing controls for a legacy fill value outside auto layout", async () => {
  const editor = createEditor({
    name: "Stabilité",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [box] = editor.insert("box", frame.id)
  editor.updateNodes([box], (node) => {
    if (node.type === "box") {
      node.autoLayout = {
        direction: "column",
        gap: 16,
        padding: [24, 24, 24, 24],
      }
      node.layout = {
        width: { mode: "fill" },
        height: { mode: "fill" },
        position: "flow",
      }
    }
  })
  const errors = vi.spyOn(console, "error")
  const user = userEvent.setup()
  render(
    <StrictMode>
      <EditorProvider editor={editor}>
        <InspectorPanel fit={() => {}} zoomTo={() => {}} />
      </EditorProvider>
    </StrictMode>
  )
  await user.click(
    screen.getByRole("combobox", { name: "Redimensionnement en largeur" })
  )
  await user.keyboard("{ArrowDown}{Escape}")
  expect(errors.mock.calls.flat().join(" ")).not.toMatch(
    /maximum update|suspend/i
  )
})
