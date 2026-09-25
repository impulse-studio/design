import { describe, expect, it } from "vitest"
import {
  detachedSnapshotSchema
  
} from "@digit-ai-studio/shared"
import type {ComponentNode} from "@digit-ai-studio/shared";
import { materializeDetachedComponent } from "./editable-elements"

const source: ComponentNode = {
  id: "source",
  type: "component",
  component: "DigiButton",
  text: "Continuer",
  slots: {
    icon: [{ id: "icon", type: "text", content: "Icône" }],
  },
}

describe("editable elements", () => {
  it("validates and materializes a detached snapshot with slots", () => {
    let id = 0
    const snapshot = detachedSnapshotSchema.parse({
      tag: "button",
      attributes: { type: "button" },
      children: [{ slot: "icon" }, { slot: "default" }],
    })

    expect(
      materializeDetachedComponent(source, snapshot, () => `new-${++id}`)
    ).toEqual([
      {
        id: "source",
        type: "element",
        tag: "button",
        attributes: { type: "button" },
        children: [
          { id: "icon", type: "text", content: "Icône" },
          { id: "new-1", type: "text", content: "Continuer" },
        ],
      },
    ])
  })

  it("rejects unsafe detached markup before materialization", () => {
    expect(
      detachedSnapshotSchema.safeParse({
        tag: "script",
        children: [],
      }).success
    ).toBe(false)
    expect(
      detachedSnapshotSchema.safeParse({
        tag: "a",
        attributes: { href: "javascript:alert(1)" },
        children: [],
      }).success
    ).toBe(false)
  })
})
