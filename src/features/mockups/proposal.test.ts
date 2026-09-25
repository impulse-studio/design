import { describe, expect, it } from "vitest"
import { emptyDocument } from "@/features/editor/document"
import { entryFor, makeLibraryNode } from "@/features/editor/library"
import { prepareMockupProposal } from "./proposal"

describe("proposition de maquette", () => {
  it("applique et valide la composition dans une seule interface", () => {
    const source = emptyDocument()
    const frame = source.pages[0].frames[0]
    const button = makeLibraryNode(entryFor("DigiButton")!)

    const result = prepareMockupProposal(source, {
      summary: "Ajoute un bouton",
      operations: [{ type: "insertNode", parentId: frame.id, node: button }],
    })

    expect(result.input.summary).toBe("Ajoute un bouton")
    expect(result.doc.pages[0].frames[0].children).toEqual([button])
    expect(source.pages[0].frames[0].children).toEqual([])
  })

  it("refuse une composition Digi isolée avant de rendre un document", () => {
    const source = emptyDocument()
    const frame = source.pages[0].frames[0]
    const item = makeLibraryNode(entryFor("DigiAccordionTrigger")!)

    expect(() =>
      prepareMockupProposal(source, {
        summary: "Composition invalide",
        operations: [{ type: "insertNode", parentId: frame.id, node: item }],
      })
    ).toThrow(/parent Digi/)
    expect(source.pages[0].frames[0].children).toEqual([])
  })
})
