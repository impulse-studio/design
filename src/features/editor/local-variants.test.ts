import { describe, expect, it } from "vitest"
import type { MockupDoc } from "@digit-ai-studio/shared"
import { findNode } from "@digit-ai-studio/shared"
import { createEditor } from "./store"
import { framesOf } from "./document"

const document: MockupDoc = {
  schemaVersion: 1,
  libVersion: "test",
  pages: [
    {
      id: "page",
      name: "Page",
      background: "#ffffff",
      frames: [
        {
          id: "frame",
          type: "frame",
          name: "Frame",
          x: 0,
          y: 0,
          width: 320,
          height: 200,
          children: [
            {
              id: "first",
              type: "component",
              component: "DigiButton",
              props: { disabled: false },
            },
            {
              id: "second",
              type: "component",
              component: "DigiButton",
              props: { disabled: false },
            },
          ],
        },
      ],
    },
  ],
}

describe("local variant commands", () => {
  it("creates, associates, propagates and detaches an instance-local definition", () => {
    const editor = createEditor({ doc: document, name: "Test", status: "draft" })
    const variantId = editor.createLocalVariant("first")!
    editor.assignLocalVariant(["second"], variantId)
    editor.select("first")
    editor.editLocalVariant(variantId)
    editor.updateSelection((node) => {
      if (node.type === "component")
        node.props = { ...node.props, disabled: true }
    })

    const first = findNode(framesOf(editor.state.get().doc), "first")!.node
    const second = findNode(framesOf(editor.state.get().doc), "second")!.node
    expect(first.type === "component" && first.localVariant?.props.disabled).toBe(true)
    expect(second.type === "component" && second.localVariant?.props.disabled).toBe(true)

    editor.assignLocalVariant(["second"], null)
    const detached = findNode(framesOf(editor.state.get().doc), "second")!.node
    expect(detached.type === "component" && detached.localVariant).toBeUndefined()
    // The instance override remains stronger than the shared variant.
    expect(detached.type === "component" && detached.props?.disabled).toBe(false)
  })
})
