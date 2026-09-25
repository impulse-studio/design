import { describe, expect, it } from "vitest"
import {
  projectedElementAttributes,
  projectedElementStyles,
  resolveComponent,
  visibleNodes
  
  
} from "@digit-ai-studio/shared"
import type {ComponentNode, Node} from "@digit-ai-studio/shared";
import { reactSnippet } from "./inspect"

describe("document projection", () => {
  it("resolves local variant values before instance overrides", () => {
    const node: ComponentNode = {
      id: "button",
      type: "component",
      component: "DigiButton",
      localVariant: {
        id: "variant",
        name: "Primary",
        props: { size: "large", disabled: false },
        text: "Variant",
        style: { opacity: 0.5 },
      },
      props: { disabled: true },
      text: "Instance",
      style: { opacity: 1 },
    }

    expect(resolveComponent(node)).toMatchObject({
      props: { size: "large", disabled: true },
      text: "Instance",
      style: { opacity: 1 },
    })
  })

  it("preserves absent optional presentation values", () => {
    expect(
      resolveComponent({
        id: "plain",
        type: "component",
        component: "DigiButton",
      })
    ).toMatchObject({ layout: undefined, style: undefined })
  })

  it("shares visibility, safe attributes and style sources with adapters", () => {
    const hidden: Node = { id: "hidden", type: "text", content: "secret", hidden: true }
    const element: Extract<Node, { type: "element" }> = {
      id: "element",
      type: "element",
      tag: "div",
      attributes: { class: "from-attribute", style: "color: red", title: "Hello" },
      inlineStyle: "display: block",
      children: [hidden],
    }

    expect(visibleNodes(element.children)).toEqual([])
    expect(projectedElementAttributes(element)).toEqual({
      class: "from-attribute",
      title: "Hello",
    })
    expect(projectedElementStyles(element)).toEqual([
      "display: block",
      "color: red",
    ])
    const snippet = reactSnippet(element)
    expect(snippet).not.toContain("secret")
    expect(snippet).toContain('color":"red"')
    expect(snippet).toContain('display":"block"')
  })
})
