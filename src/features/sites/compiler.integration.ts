// @vitest-environment node
import { readFile } from "node:fs/promises"
import { build } from "esbuild"
import { describe, expect, it, vi } from "vitest"
import { JSDOM } from "jsdom"
import { applySiteProposal, normalizeSources, elementsOf } from "./source"
import { createSiteDocument } from "./template"
import { compileOptions } from "./compiler"
import { bridgeSource, previewHtml, previewMessageSchema } from "./bridge"

const runtime = JSON.parse(
  await readFile("public/site-runtime/modules.json", "utf8")
)
describe("isolated project compilation", () => {
  it("compiles the full React application and preview bridge with local dependencies", async () => {
    const doc = createSiteDocument()
    const result = await build(
      compileOptions(doc, runtime, {
        "studio-entry.ts": "import './studio-bridge';import './src/main';",
        "studio-bridge.ts": bridgeSource("test", 2, "/", true, false),
      })
    )
    const js = result.outputFiles![0].text
    expect(js).toContain("createRoot")
    expect(js).not.toContain("data:font/woff2;base64,")
    const html = previewHtml(js)
    expect(html).toContain("connect-src 'none'")
    expect(html).not.toContain("https://esm.sh")
  }, 20000)
  it("renders a blank preview and the first iteration without a router", async () => {
    const blank = createSiteDocument()
    const edited = applySiteProposal(blank, {
      summary: "Premier contenu",
      operations: [
        {
          type: "writeFile",
          path: "src/App.tsx",
          content: "export function App(){return <h1>Mon premier site</h1>}",
        },
      ],
    })
    for (const doc of [blank, edited]) {
      const result = await build(
        compileOptions(doc, runtime, {
          "studio-entry.ts": "import './studio-bridge';import './src/main';",
          "studio-bridge.ts": bridgeSource("test", 0, "/", true, false),
        })
      )
      const dom = new JSDOM('<div id="root"></div>', {
        runScripts: "outside-only",
      })
      const send = vi.spyOn(dom.window, "postMessage")
      try {
        dom.window.eval(result.outputFiles![0].text)
        await vi.waitFor(() =>
          expect(send).toHaveBeenCalledWith(
            expect.objectContaining({ type: "ready" }),
            "*"
          )
        )
        if (doc === blank)
          expect(dom.window.document.getElementById("root")!.innerHTML).toBe("")
        else
          await vi.waitFor(() =>
            expect(dom.window.document.querySelector("h1")?.textContent).toBe(
              "Mon premier site"
            )
          )
      } finally {
        dom.window.close()
      }
    }
  })
  it("selects controls and nested HTML in a normalized legacy toolbar", async () => {
    const legacy = createSiteDocument()
    legacy.files["src/components/ui/controls.tsx"] = `
      export const OptionSelect = () => <select><option>25</option></select>;
      export const Button = () => <button>2</button>;
    `
    legacy.files["src/App.tsx"] = `
      import { OptionSelect, Button } from "./components/ui/controls";
      export function App() { return <div data-digi-id="ds-toolbar-0"><OptionSelect/><nav data-digi-id="ds-toolbar-1"><Button/></nav></div> }
    `
    const doc = normalizeSources(legacy)
    const elements = elementsOf(doc)
    const result = await build(
      compileOptions(doc, runtime, {
        "studio-entry.ts": "import './studio-bridge';import './src/main';",
        "studio-bridge.ts": bridgeSource("test", 0, "/", true, false),
      })
    )
    const dom = new JSDOM('<div id="root"></div>', {
      runScripts: "outside-only",
      pretendToBeVisual: true,
    })
    const send = vi.spyOn(dom.window, "postMessage")
    vi.spyOn(
      dom.window.Element.prototype,
      "getBoundingClientRect"
    ).mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      width: 100,
      height: 30,
      right: 100,
      bottom: 30,
      toJSON: () => ({}),
    })
    try {
      dom.window.eval(result.outputFiles![0].text)
      const controlId = elements.find((item) => item.tag === "OptionSelect")!.id
      await vi.waitFor(() =>
        expect(send).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "inventory",
            elements: expect.arrayContaining([{ id: controlId, count: 1 }]),
          }),
          "*"
        )
      )
      for (const tag of ["select", "button", "nav"]) {
        const target = dom.window.document.querySelector(tag)!
        target.dispatchEvent(
          new dom.window.MouseEvent("click", { bubbles: true })
        )
        const sourceTag =
          tag === "select" ? "OptionSelect" : tag === "button" ? "Button" : tag
        const id = elements.find((item) => item.tag === sourceTag)!.id
        expect(send).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: "selection", id, tag }),
          "*"
        )
      }
    } finally {
      dom.window.close()
    }
  })
  it("rejects unsupported imports without executing generated code", async () => {
    const doc = createSiteDocument()
    doc.files["src/main.tsx"] = "import 'https://example.com/evil.js'"
    await expect(build(compileOptions(doc, runtime))).rejects.toThrow(
      "Import indisponible"
    )
  })
  it("escapes HTML script termination and validates revision messages", () => {
    expect(previewHtml('console.log("</script><script>evil")')).toContain(
      "<\\/script>"
    )
    expect(
      previewMessageSchema.safeParse({
        source: "other",
        token: "x",
        revision: 1,
        type: "ready",
      }).success
    ).toBe(false)
  })
})
