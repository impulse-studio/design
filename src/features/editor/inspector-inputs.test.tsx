import { act, fireEvent, render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { findNode } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { emptyDocument, framesOf } from "./document"
import { useEditorState } from "./context"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { NumberInput } from "@/components/shared/fields/NumberInput"
import { ColorCodeInput } from "@/components/shared/fields/ColorCodeInput"
import { toHex } from "@/lib/colors"
import { resolveEditorColor } from "./colors"
import { ComponentPropField } from "@/pages/editor/components/inspector/controls/ComponentPropField"
import { LayoutSection } from "@/pages/editor/components/inspector/sections/LayoutSection"
import { TextSection } from "@/pages/editor/components/inspector/sections/TextSection"

const setup = () =>
  createEditor({ name: "Inspecteur", status: "draft", doc: emptyDocument() })

const NumberHarness = ({ editor }: { editor: ReturnType<typeof setup> }) => {
  const x = useEditorState((s) => framesOf(s.doc)[0].x)
  return (
    <NumberInput
      label="X"
      value={x}
      onChange={(value) =>
        editor.change((doc) => {
          framesOf(doc)[0].x = value
        })
      }
    />
  )
}
const ColorHarness = ({ editor }: { editor: ReturnType<typeof setup> }) => {
  const color = useEditorState(
    (s) => framesOf(s.doc)[0].style?.background ?? "#123456"
  )
  return (
    <ColorCodeInput
      label="HEX"
      color={resolveEditorColor(color)}
      format="hex"
      onChange={(value) =>
        editor.change((doc) => {
          framesOf(doc)[0].style = { background: toHex(value) }
        })
      }
    />
  )
}

describe("inspector numeric editing", () => {
  it("keeps an expression intact, commits one history entry and restores the initial value with undo", async () => {
    const editor = setup(),
      user = userEvent.setup()
    const view = render(
      <EditorProvider editor={editor}>
        <NumberHarness editor={editor} />
      </EditorProvider>
    )
    const field = view.getByRole("spinbutton", {
      name: "X",
    }) as HTMLInputElement
    await user.click(field)
    await user.keyboard("(20+4)/2")
    expect(field.value).toBe("(20+4)/2")
    await user.keyboard("{Enter}")
    expect(field.value).toBe("12")
    expect(framesOf(editor.state.get().doc)[0].x).toBe(12)
    expect(editor.state.get().past).toHaveLength(1)
    act(() => editor.undo())
    expect(field.value).toBe("0")
  })
  it("supports fractional and large nudges, cancels with Escape, and retains redo history", async () => {
    const editor = setup(),
      user = userEvent.setup()
    editor.change((doc) => {
      framesOf(doc)[0].x = 8
    })
    editor.undo()
    const view = render(
      <EditorProvider editor={editor}>
        <NumberHarness editor={editor} />
      </EditorProvider>
    )
    const field = view.getByRole("spinbutton", {
      name: "X",
    }) as HTMLInputElement
    await user.click(field)
    await user.keyboard("{Shift>}{ArrowUp}{/Shift}{Alt>}{ArrowDown}{/Alt}")
    expect(field.value).toBe("9.9")
    await user.keyboard("{Escape}")
    expect(field.value).toBe("0")
    expect(editor.state.get().past).toHaveLength(0)
    expect(editor.state.get().future).toHaveLength(1)
    act(() => editor.redo())
    expect(field.value).toBe("8")
  })
  it.each(["", "-", "23/0", "12oops", "(12+"])(
    "reverts an incomplete or invalid value: %s",
    async (text) => {
      const editor = setup(),
        user = userEvent.setup()
      const view = render(
        <EditorProvider editor={editor}>
          <NumberHarness editor={editor} />
        </EditorProvider>
      )
      const field = view.getByRole("spinbutton", {
        name: "X",
      }) as HTMLInputElement
      await user.click(field)
      fireEvent.change(field, { target: { value: "25" } })
      fireEvent.change(field, { target: { value: text } })
      await user.tab()
      expect(field.value).toBe("0")
      expect(framesOf(editor.state.get().doc)[0].x).toBe(0)
      expect(editor.state.get().past).toHaveLength(0)
    }
  )
})

describe("color code editing", () => {
  it("allows typing all six HEX characters without expanding the three-character intermediate color", async () => {
    const editor = setup(),
      user = userEvent.setup()
    const view = render(
      <EditorProvider editor={editor}>
        <ColorHarness editor={editor} />
      </EditorProvider>
    )
    const field = view.getByRole("textbox", { name: "HEX" }) as HTMLInputElement
    await user.click(field)
    await user.keyboard("ABCDEF")
    expect(field.value).toBe("ABCDEF")
    await user.keyboard("{Enter}")
    expect(framesOf(editor.state.get().doc)[0].style?.background).toBe(
      "#ABCDEF"
    )
    expect(editor.state.get().past).toHaveLength(1)
  })
  it("preserves alpha for HEX edits and restores the exact original color on Escape", async () => {
    const editor = setup(),
      user = userEvent.setup()
    editor.change((doc) => {
      framesOf(doc)[0].style = { background: "#12345680" }
    })
    const before = editor.state.get().doc
    const view = render(
      <EditorProvider editor={editor}>
        <ColorHarness editor={editor} />
      </EditorProvider>
    )
    const field = view.getByRole("textbox", { name: "HEX" }) as HTMLInputElement
    await user.click(field)
    await user.keyboard("FF0000")
    await user.keyboard("{Enter}")
    expect(framesOf(editor.state.get().doc)[0].style?.background).toBe(
      "#FF000080"
    )
    act(() => editor.undo())
    await user.click(field)
    await user.keyboard("00FF00")
    await user.keyboard("{Escape}")
    expect(editor.state.get().doc).toBe(before)
    expect(field.value).toBe("123456")
  })
})

it("shows only properties shared by a heterogeneous selection", () => {
  const editor = setup(),
    frame = framesOf(editor.state.get().doc)[0]
  const [box] = editor.insert("box", frame.id),
    [text] = editor.insert("text", frame.id)
  editor.set({ selectedIds: [box, text] })
  const view = render(
    <EditorProvider editor={editor}>
      <LayoutSection />
      <TextSection />
    </EditorProvider>
  )
  expect(view.queryByText("Auto layout")).toBeTruthy()
  expect(view.queryByLabelText("Contenu")).toBeNull()
})

it("does not link unequal padding values by default and switches auto gap to a fixed gap", async () => {
  const editor = setup(),
    user = userEvent.setup()
  const [box] = editor.insert("box")
  editor.updateNodes([box], (node) => {
    if (node.type === "box")
      node.autoLayout = {
        direction: "row",
        padding: [1, 2, 3, 4],
        gap: "auto",
        justify: "between",
      }
  })
  const view = render(
    <EditorProvider editor={editor}>
      <LayoutSection />
    </EditorProvider>
  )
  expect(view.getByRole("button", { name: "Lier les paddings" })).toBeTruthy()
  const gap = view.getByRole("spinbutton", { name: "Gap" })
  expect(gap.getAttribute("placeholder")).toBe("Auto")
  await user.click(view.getByRole("spinbutton", { name: "Haut" }))
  await user.keyboard("8{Enter}")
  await user.click(gap)
  await user.keyboard("16{Enter}")
  expect(findNode(framesOf(editor.state.get().doc), box)?.node).toMatchObject({
    autoLayout: { padding: [8, 2, 3, 4], gap: 16, justify: "start" },
  })
})

it("offers Figma flows on frames and changes the document through the inspector", async () => {
  const editor = setup(),
    user = userEvent.setup()
  const frame = framesOf(editor.state.get().doc)[0]
  editor.select(frame.id)
  const view = render(
    <EditorProvider editor={editor}>
      <LayoutSection />
    </EditorProvider>
  )
  expect(view.getByRole("button", { name: "Libre" })).toBeTruthy()
  await user.click(view.getByRole("button", { name: "Vertical" }))
  expect(framesOf(editor.state.get().doc)[0].autoLayout?.direction).toBe(
    "column"
  )
  expect(view.getByRole("spinbutton", { name: "W" })).toBeTruthy()
  await user.click(view.getByRole("button", { name: "Grille" }))
  expect(framesOf(editor.state.get().doc)[0].autoLayout?.direction).toBe("grid")
  expect(view.getByRole("spinbutton", { name: "Colonnes" })).toBeTruthy()
  await user.click(view.getByRole("button", { name: "Libre" }))
  expect(framesOf(editor.state.get().doc)[0].autoLayout).toBeUndefined()
})

it("detaches a spacing token using its measured value rather than zero", () => {
  const editor = setup(),
    frame = framesOf(editor.state.get().doc)[0],
    [id] = editor.insert("box")
  editor.updateNodes([id], (node) => {
    if (node.type === "box" && node.autoLayout)
      node.autoLayout.gap = { token: "spacing-md" }
  })
  editor.set({
    layouts: {
      [frame.id]: {
        contentHeight: 900,
        rects: {},
        computed: { [id]: { gap: "16px" } },
      },
    },
  })
  const view = render(
    <EditorProvider editor={editor}>
      <LayoutSection />
    </EditorProvider>
  )
  fireEvent.click(
    view.getByRole("button", {
      name: "Gap : spacing-md, utiliser une valeur libre",
    })
  )
  expect(findNode(framesOf(editor.state.get().doc), id)?.node).toMatchObject({
    autoLayout: { gap: 16 },
  })
})

it("does not overwrite mixed JSON on focus/blur and cancels a JSON edit with Escape", async () => {
  const editor = setup(),
    user = userEvent.setup(),
    change = vi.fn()
  const view = render(
    <EditorProvider editor={editor}>
      <ComponentPropField
        prop={{ name: "data", type: "unknown", required: false }}
        value={undefined}
        mixed
        onChange={change}
      />
    </EditorProvider>
  )
  const field = view.getByRole("textbox", { name: "data · JSON" })
  await user.click(field)
  await user.tab()
  expect(change).not.toHaveBeenCalled()
  await user.click(field)
  fireEvent.change(field, { target: { value: '{"title":"Test"}' } })
  await user.keyboard("{Escape}")
  expect(change).not.toHaveBeenCalled()
  expect((field as HTMLTextAreaElement).value).toBe("")
  expect(editor.state.get().transaction).toBeNull()
})
