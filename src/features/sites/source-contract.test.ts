import { describe, expect, it } from "vitest"
import { applyTextEdit, elementsOf, normalizeSources } from "./source"
import { createSiteDocument } from "./document.fixture"

for (const kind of ["react-vite", "vue-vite"] as const)
  describe(`${kind} source contract`, () => {
    const extension = kind === "react-vite" ? "tsx" : "vue"
    const source = (content: string) =>
      kind === "react-vite"
        ? `export function Panel(){return <main>${content}</main>}`
        : `<template><main>${content}</main></template><script setup lang="ts">const message = "dynamic"</script><style scoped>main { color: red }</style>`
    it("preserves unique existing IDs and repairs collisions across files without modifying the input", () => {
      const doc = createSiteDocument(kind)
      const path = `src/Panel.${extension}`
      doc.files[path] = source('<h1 data-digi-id="ds-shared">Hello</h1>')
      doc.files[`src/Other.${extension}`] = source(
        '<p data-digi-id="ds-shared">Other</p>'
      )
      const original = structuredClone(doc)
      const normalized = normalizeSources(doc)
      const ids = elementsOf(normalized).map((element) => element.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids.filter((id) => id === "ds-shared")).toHaveLength(1)
      expect(normalizeSources(normalized)).toEqual(normalized)
      expect(doc).toEqual(original)
      const title = elementsOf(normalized).find(
        (element) => element.tag === "h1"
      )!
      const edited = applyTextEdit(normalized, title.id, "<new> & {literal}")
      expect(edited.files[path]).toContain("&lt;new&gt;")
      expect(
        elementsOf(edited).find((element) => element.id === title.id)?.text
      ).toBe("<new> & {literal}")
      if (kind === "vue-vite") {
        expect(edited.files[path]).toContain(
          '<script setup lang="ts">const message = "dynamic"</script>'
        )
        expect(edited.files[path]).toContain(
          "<style scoped>main { color: red }</style>"
        )
      }
    })
    it("rejects dynamic text and leaves protected UI sources untouched", () => {
      const doc = createSiteDocument(kind)
      const path = `src/Dynamic.${extension}`
      doc.files[path] = source(
        kind === "react-vite" ? "<p>{message}</p>" : "<p>{{ message }}</p>"
      )
      const protectedPath = `src/components/ui/Control.${extension}`
      doc.files[protectedPath] = source("<button>Control</button>")
      const normalized = normalizeSources(doc)
      expect(normalized.files[protectedPath]).toBe(doc.files[protectedPath])
      const paragraph = elementsOf(normalized).find(
        (element) => element.file === path && element.tag === "p"
      )!
      expect(() => applyTextEdit(normalized, paragraph.id, "replace")).toThrow(
        "dynamique"
      )
    })
  })
