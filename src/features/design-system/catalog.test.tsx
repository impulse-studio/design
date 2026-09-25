import { describe, expect, it } from "vitest"
import { render, act } from "@testing-library/react"
import {
  transpileModule,
  ScriptTarget,
  JsxEmit,
  DiagnosticCategory,
} from "typescript"
import { catalog } from "./catalog"
import { defaultOptions } from "./types"
import { searchCatalog } from "./search"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router"

describe("catalogue", () => {
  it("fournit des imports utilisables sans déduction par la page", () => {
    const files = new Set(
      Object.keys(import.meta.glob("/src/components/**/*.tsx"))
    )
    for (const entry of catalog) {
      if (entry.kind === "foundation") expect(entry.importPath).toBeNull()
      else
        expect(
          files.has(entry.importPath!.replace("@/", "/src/") + ".tsx"),
          entry.id
        ).toBe(true)
      expect(Array.isArray(entry.properties)).toBe(true)
    }
    expect(catalog.find((entry) => entry.id === "ai-sidebar")?.importPath).toBe(
      "@/components/shared/ai-sidebar/AISidebar"
    )
  })

  it("référence chaque primitive disponible, hors sélecteur natif", () => {
    const files = Object.keys(import.meta.glob("/src/components/ui/*.tsx"))
      .map((path) => path.split("/").pop()!.replace(".tsx", ""))
      .filter((name) => name !== "native-select" && /^[a-z]/.test(name))
    expect(
      catalog
        .filter((entry) => entry.kind === "component")
        .map((entry) => entry.id)
        .sort()
    ).toEqual(files.sort())
    expect(new Set(catalog.map((entry) => entry.id)).size).toBe(catalog.length)
  })

  it("recherche par intention, avec accents et plusieurs mots", () => {
    expect(searchCatalog(catalog, "BOUTON").map((entry) => entry.id)).toContain(
      "button"
    )
    expect(
      searchCatalog(catalog, "selecteur").map((entry) => entry.id)
    ).toContain("select")
    expect(
      searchCatalog(catalog, "tableau DONNÉES").map((entry) => entry.id)
    ).toContain("data-table")
    expect(searchCatalog(catalog, "inexistant zzz")).toEqual([])
  })

  it.each(catalog)(
    "charge, affiche et fournit un exemple TSX valide : $id",
    async (entry) => {
      const example = await entry.load()
      const options = defaultOptions(entry)
      const router = createRouter({
        routeTree: createRootRoute(),
        history: createMemoryHistory({ initialEntries: ["/design-system"] }),
      })
      const { container, rerender } = render(
        <RouterContextProvider router={router}>
          <TooltipProvider>
            <example.Component options={options} />
          </TooltipProvider>
        </RouterContextProvider>
      )
      await act(async () => {})
      expect(container.innerHTML.length).toBeGreaterThan(0)
      const choices = [
        ...entry.variants.map((variant) => ({ ...options, variant })),
        ...entry.sizes.map((size) => ({ ...options, size })),
        ...entry.states.map((state) => ({ ...options, state })),
      ]
      for (const choice of choices) {
        rerender(
          <RouterContextProvider router={router}>
            <TooltipProvider>
              <example.Component options={choice} />
            </TooltipProvider>
          </RouterContextProvider>
        )
        const code = example.getCode(choice)
        expect(code).toContain("export function")
        expect(code).not.toMatch(/ExampleProps|\?raw|createExampleCode/)
        const result = transpileModule(code, {
          fileName: entry.id + ".tsx",
          compilerOptions: {
            target: ScriptTarget.ES2022,
            jsx: JsxEmit.ReactJSX,
          },
          reportDiagnostics: true,
        })
        expect(
          result.diagnostics?.filter(
            (item) => item.category === DiagnosticCategory.Error
          )
        ).toEqual([])
      }
    }
  )
})
