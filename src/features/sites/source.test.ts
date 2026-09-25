import { describe, expect, it } from "vitest"
import { unzipSync, strFromU8 } from "fflate"
import { createSiteDocument } from "./template"
import {
  applySiteProposal,
  applyTextEdit,
  applyVisualEdit,
  elementsOf,
  normalizeSources,
} from "./source"
import { sourceElementName } from "./element-name"
import { exportSite } from "./export"
import { filePathSchema, siteDocumentSchema, visualEditSchema } from "./schema"

const createEditableDocument = () =>
  applySiteProposal(createSiteDocument(), {
    summary: "Premier contenu",
    operations: [
      {
        type: "writeFile",
        path: "src/App.tsx",
        content:
          "export function App(){return <main><h1>Bienvenue</h1><p>{1 + 1}</p></main>}",
      },
    ],
  })

describe("React file projects", () => {
  it("keeps stable IDs and exports a complete independent project", () => {
    const doc = createSiteDocument()
    expect(doc.assets).toEqual({})
    expect(Object.keys(doc.dependencies).sort()).toEqual(["react", "react-dom"])
    expect(doc.routes).toEqual([{ path: "/", name: "Accueil" }])
    expect(doc.files["src/App.tsx"]).toContain("return null")
    expect(normalizeSources(doc)).toEqual(doc)
    expect(new Set(elementsOf(doc).map((e) => e.id)).size).toBe(
      elementsOf(doc).length
    )
    const zip = unzipSync(exportSite(doc))
    expect(Object.keys(zip)).toEqual(
      expect.arrayContaining([
        "package.json",
        "pnpm-lock.yaml",
        "vite.config.ts",
        "src/App.tsx",
        "src/styles.css",
      ])
    )
    expect(strFromU8(zip["src/main.tsx"])).not.toContain("studio-bridge")
    expect(strFromU8(zip["package.json"])).not.toContain("workspace:")
  })
  it("upgrades legacy toolbars without changing existing HTML ids", () => {
    const legacy = createSiteDocument()
    legacy.files["src/Toolbar.tsx"] = `export function Toolbar() {
      return <div data-digi-id="ds-toolbar-0"><OptionSelect /><nav data-digi-id="ds-toolbar-1"><Button>2</Button></nav></div>
    }`
    const normalized = normalizeSources(legacy)
    const elements = elementsOf(normalized).filter(
      (item) => item.file === "src/Toolbar.tsx"
    )
    expect(elements.map((item) => item.tag)).toEqual([
      "div",
      "OptionSelect",
      "nav",
      "Button",
    ])
    expect(elements.find((item) => item.tag === "div")?.id).toBe("ds-toolbar-0")
    expect(elements.find((item) => item.tag === "nav")?.id).toBe("ds-toolbar-1")
    expect(elements.map(sourceElementName)).toEqual([
      "Toolbar",
      "OptionSelect",
      "nav",
      "Button",
    ])
    expect(normalizeSources(normalized)).toEqual(normalized)
    expect(legacy.files["src/Toolbar.tsx"]).not.toContain(
      "<OptionSelect data-digi-id"
    )
  })
  it("preserves visual changes through unrelated AI edits and round trips", () => {
    let doc = createEditableDocument()
    const title = elementsOf(doc).find((e) => e.tag === "h1")!
    doc = applyTextEdit(doc, title.id, "Bienvenue <ici> & {vous}")
    doc = applyVisualEdit(doc, {
      id: title.id,
      breakpoint: "base",
      styles: { gap: "24px", padding: "32px" },
    })
    doc = applyVisualEdit(doc, {
      id: title.id,
      breakpoint: "mobile",
      styles: { padding: "12px" },
    })
    doc = applySiteProposal(doc, {
      summary: "Une page",
      operations: [
        {
          type: "writeFile",
          path: "src/pages/Extra.tsx",
          content: "export function Extra(){return <h1>Une idée libre</h1>}",
        },
      ],
    })
    expect(doc.files["src/visual.css"]).toContain("@media(max-width:767px)")
    expect(doc.files["src/visual.css"]).toContain("gap:24px")
    expect(doc.files[title.file]).toContain("&lt;ici&gt;")
    expect(siteDocumentSchema.parse(JSON.parse(JSON.stringify(doc)))).toEqual(
      doc
    )
  })
  it("replaces one exact occurrence without sending a complete file", () => {
    const doc = createEditableDocument()
    const updated = applySiteProposal(doc, {
      summary: "Modifier le titre",
      operations: [
        {
          type: "replaceInFile",
          path: "src/App.tsx",
          oldText: "Bienvenue",
          newText: "Bonjour",
        },
      ],
    })
    expect(updated.files["src/App.tsx"]).toContain("Bonjour")
    expect(doc.files["src/App.tsx"]).toContain("Bienvenue")
    expect(() =>
      applySiteProposal(doc, {
        summary: "Ambigu",
        operations: [
          {
            type: "replaceInFile",
            path: "src/App.tsx",
            oldText: "main",
            newText: "section",
          },
        ],
      })
    ).toThrow("exactement une fois")
  })
  it("refuses edits to dynamic text, protected files, unsafe paths and CSS", () => {
    const doc = createEditableDocument()
    const dynamic = elementsOf(doc).find((e) => e.text === null)!
    expect(() => applyTextEdit(doc, dynamic.id, "overwrite")).toThrow(
      "dynamique"
    )
    expect(() =>
      applySiteProposal(doc, {
        summary: "bad",
        operations: [
          { type: "writeFile", path: "package.json", content: "{}" },
        ],
      })
    ).toThrow("protégé")
    for (const path of [
      "../escape.ts",
      "src/../../escape.ts",
      "/tmp/code.ts",
      ".env",
      "node_modules/foo.ts",
    ])
      expect(filePathSchema.safeParse(path).success).toBe(false)
    expect(
      visualEditSchema.safeParse({
        id: dynamic.id,
        breakpoint: "base",
        styles: { color: "red;}body{display:none" },
      }).success
    ).toBe(false)
  })
  it("orders mobile overrides after tablet regardless of editing order", () => {
    let doc = createEditableDocument()
    const id = elementsOf(doc)[0].id
    doc = applyVisualEdit(doc, {
      id,
      breakpoint: "mobile",
      styles: { padding: "12px" },
    })
    doc = applyVisualEdit(doc, {
      id,
      breakpoint: "tablet",
      styles: { padding: "24px" },
    })
    expect(doc.files["src/visual.css"].indexOf("1023")).toBeLessThan(
      doc.files["src/visual.css"].indexOf("767")
    )
  })
})
