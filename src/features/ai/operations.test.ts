import { describe, expect, it } from "vitest"
import { z } from "zod"
import { emptyDocument } from "@/features/editor/document"
import { library, makeLibraryNode, entryFor } from "@/features/editor/library"
import { createEditor } from "@/features/editor/store"
import {
  applyOperations,
  canonicalDocument,
  proposalInputSchema,
} from "./operations"
import type { MockupOperation } from "./operations"
import { aiCatalog, validateAiComposition } from "./catalog"

const proposal = (operations: MockupOperation[]) => ({
  summary: "Modifications",
  operations,
})
describe("propositions Codex", () => {
  it("accepte les recettes Digi et refuse leurs enfants sans parent", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    const accordion = makeLibraryNode(entryFor("DigiAccordion")!)
    const next = applyOperations(
      doc,
      proposal([{ type: "insertNode", parentId: frame.id, node: accordion }]),
      library
    )
    expect(validateAiComposition(doc, next)).toEqual(next)
    expect(
      aiCatalog.some((entry) => entry.name === "DigiAccordionTrigger")
    ).toBe(false)
    const isolated = applyOperations(
      doc,
      proposal([
        {
          type: "insertNode",
          parentId: frame.id,
          node: makeLibraryNode(entryFor("DigiAccordionTrigger")!),
        },
      ]),
      library
    )
    expect(() => validateAiComposition(doc, isolated)).toThrow(/parent Digi/)
  })
  it("crée, modifie et déplace des calques sans muter la source", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    const next = applyOperations(
      doc,
      proposal([
        {
          type: "insertNode",
          parentId: frame.id,
          node: {
            id: "box",
            type: "box",
            autoLayout: { direction: "column" },
            children: [],
          },
        },
        {
          type: "insertNode",
          parentId: frame.id,
          node: { id: "title", type: "text", content: "Avant" },
        },
        { type: "updateNode", id: "title", patch: { content: "Après" } },
        { type: "moveNode", id: "title", parentId: "box", index: 0 },
      ]),
      library
    )
    expect(frame.children).toEqual([])
    expect(next.pages[0].frames[0].children).toMatchObject([
      { id: "box", children: [{ id: "title", content: "Après" }] },
    ])
  })
  it("insère une vraie composition Digi, puis supprime un calque", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    const button = makeLibraryNode(entryFor("DigiButton")!)
    const next = applyOperations(
      doc,
      proposal([{ type: "insertNode", parentId: frame.id, node: button }]),
      library
    )
    expect(next.pages[0].frames[0].children[0]).toEqual(button)
    expect(
      applyOperations(
        next,
        proposal([{ type: "removeNode", id: button.id }]),
        library
      ).pages[0].frames[0].children
    ).toEqual([])
  })
  it("applique une proposition en une seule étape annulable", () => {
    const doc = emptyDocument(),
      editor = createEditor({ doc, name: "Test", status: "draft" })
    const next = applyOperations(
      doc,
      proposal([
        {
          type: "updateNode",
          id: doc.pages[0].frames[0].id,
          patch: { width: 1280, name: "Nouveau" },
        },
      ]),
      library
    )
    editor.replace(next)
    expect(editor.state.get().past).toHaveLength(1)
    editor.undo()
    expect(editor.state.get().doc).toEqual(doc)
    editor.redo()
    expect(editor.state.get().doc).toEqual(next)
  })
  it("crée une frame et refuse les identifiants dupliqués", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    expect(
      applyOperations(
        doc,
        proposal([{ type: "addFrame", frame: { ...frame, id: "second" } }]),
        library
      ).pages[0].frames
    ).toHaveLength(2)
    expect(() =>
      applyOperations(doc, proposal([{ type: "addFrame", frame }]), library)
    ).toThrow(/dupliqué/)
  })
  it("refuse les cycles et laisse la source intacte en cas d’échec", () => {
    const doc = emptyDocument(),
      id = doc.pages[0].frames[0].id
    const before = canonicalDocument(doc)
    expect(() =>
      applyOperations(
        doc,
        proposal([
          {
            type: "insertNode",
            parentId: id,
            node: {
              type: "box",
              id: "box",
              autoLayout: { direction: "row" },
              children: [],
            },
          },
          { type: "moveNode", id: "box", parentId: "box" },
        ]),
        library
      )
    ).toThrow(/circulaire/)
    expect(canonicalDocument(doc)).toBe(before)
  })
  it("protège les verrous hérités et les descendants verrouillés", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    frame.children.push({
      type: "text",
      id: "locked",
      content: "Privé",
      locked: true,
    })
    for (const operations of [
      [{ type: "updateNode", id: "locked", patch: { content: "Non" } }],
      [{ type: "removeNode", id: frame.id }],
      [{ type: "updateNode", id: frame.id, patch: { width: 900 } }],
    ] satisfies MockupOperation[][])
      expect(() => applyOperations(doc, proposal(operations), library)).toThrow(
        /verrouillé/
      )
    frame.locked = true
    expect(() =>
      applyOperations(
        doc,
        proposal([
          {
            type: "insertNode",
            parentId: frame.id,
            node: { id: "n", type: "text", content: "Non" },
          },
        ]),
        library
      )
    ).toThrow(/verrouillé/)
  })
  it("rejette les composants inconnus, slots et props invalides", () => {
    const doc = emptyDocument(),
      frame = doc.pages[0].frames[0]
    expect(() =>
      applyOperations(
        doc,
        proposal([
          {
            type: "insertNode",
            parentId: frame.id,
            node: {
              id: "unknown",
              type: "component",
              component: "FakeComponent",
            },
          },
        ]),
        library
      )
    ).toThrow(/inconnu/)
    const button = makeLibraryNode(entryFor("DigiButton")!)
    const next = applyOperations(
      doc,
      proposal([{ type: "insertNode", parentId: frame.id, node: button }]),
      library
    )
    expect(() =>
      applyOperations(
        next,
        proposal([
          {
            type: "insertNode",
            parentId: button.id,
            slot: "fake-slot",
            node: { id: "child", type: "text", content: "Non" },
          },
        ]),
        library
      )
    ).toThrow(/Slot/)
    expect(() =>
      applyOperations(
        next,
        proposal([
          {
            type: "updateNode",
            id: button.id,
            patch: { props: { onClick: "bad" } },
          },
        ]),
        library
      )
    ).toThrow(/éditable/)
  })
  it("interdit les remplacements d’arbre et la pollution de prototype", () => {
    const doc = emptyDocument(),
      id = doc.pages[0].frames[0].id
    for (const patch of [
      { children: [] },
      { locked: false },
      JSON.parse('{"__proto__":{"polluted":true}}'),
    ]) {
      expect(() =>
        applyOperations(
          doc,
          { summary: "Non", operations: [{ type: "updateNode", id, patch }] },
          library
        )
      ).toThrow(/dédiée/)
    }
    expect(Object.prototype).not.toHaveProperty("polluted")
  })
  it("stabilise l’empreinte JSONB et fournit le schéma du tool Codex", () => {
    expect(canonicalDocument({ b: [1, 2], a: { d: 1, c: 2 } })).toBe(
      canonicalDocument({ a: { c: 2, d: 1 }, b: [1, 2] })
    )
    const schema = z.toJSONSchema(proposalInputSchema, {
      target: "draft-7",
      reused: "ref",
    })
    expect(schema.type).toBe("object")
    expect(schema.required).toContain("operations")
  })
})
