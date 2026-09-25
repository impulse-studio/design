import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { findNode, shellMessageSchema } from "@digit-ai-studio/shared"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { InspectorPanel } from "@/pages/editor/components/inspector/InspectorPanel"
import { CanvasWorld } from "@/pages/editor/components/canvas/CanvasWorld"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"

it("edits a Vue component through the inspector and immediately sends its text, props, paint and dimensions to the renderer", async () => {
  const editor = createEditor({
    name: "Component",
    status: "draft",
    doc: emptyDocument(),
  })
  const frame = framesOf(editor.state.get().doc)[0]
  const [id] = editor.insert("DigiButton", frame.id)
  editor.select(id)
  const user = userEvent.setup()
  const view = render(
    <EditorProvider editor={editor}>
      <CanvasWorld />
      <InspectorPanel fit={() => {}} zoomTo={() => {}} />
    </EditorProvider>
  )
  const iframe = view.container.querySelector("iframe")!
  const send = vi.spyOn(iframe.contentWindow!, "postMessage")
  fireEvent.load(iframe)
  send.mockClear()
  const content = screen.getByRole("textbox", { name: "Contenu" })
  await user.clear(content)
  await user.type(content, "Valider")
  await user.tab()
  await user.click(
    screen.getByRole("switch", { name: "disabled" })
  )
  await user.click(screen.getByRole("button", { name: "Ajouter un fond" }))
  const color = screen.getByRole("textbox", { name: "Couleur de fond HEX" })
  await user.clear(color)
  await user.type(color, "FF0000{Enter}")
  const width = screen.getByRole("spinbutton", { name: "W" })
  await user.clear(width)
  await user.type(width, "240{Enter}")
  const node = findNode(framesOf(editor.state.get().doc), id)!.node
  expect(node).toMatchObject({
    type: "component",
    component: "DigiButton",
    text: "Valider",
    props: { disabled: true },
    layout: { width: { mode: "fixed", value: 240 } },
  })
  expect(node.style?.background).toMatch(/ff0000/i)
  const messages = send.mock.calls.map(([message]) =>
    shellMessageSchema.parse(message)
  )
  const last = messages.filter((message) => message.type === "replace").at(-1)!
  expect(last.frame.children.find((child) => child.id === id)).toEqual(node)
  expect(editor.state.get().transaction).toBeNull()
})
