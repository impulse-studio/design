import { describe, expect, it } from "vitest"
import { strToU8, strFromU8, unzipSync, zipSync } from "fflate"
import { createSiteDocument } from "@/features/sites/document.fixture"
import {
  applySiteProposal,
  applyTextEdit,
  elementsOf,
} from "@/features/sites/source"
import { exportSite } from "@/features/sites/export"
import { applyLibrary, compareLibrary, libraryPrefix } from "./merge"
import { libraryPayloadSchema } from "@/validators/libraries/payload"
import type { LibrarySnapshot } from "@/validators/libraries/payload"
import { payloadFromEntries, readLibraryFiles } from "./import"

const id = "a6fffc7a-c004-47b6-933a-c890a69fbffb"
const snapshot = (
  version = 1,
  kind: "react-vite" | "vue-vite" = "react-vite"
): LibrarySnapshot => ({
  id: crypto.randomUUID(),
  libraryId: id,
  name: "UI",
  version,
  payload: libraryPayloadSchema.parse({
    framework: kind,
    files:
      kind === "vue-vite"
        ? {
            "Button.vue": `<script setup lang="ts">defineProps<{label?:string}>()</script><template><button>Version ${version}</button></template>`,
          }
        : {
            "Button.tsx": `export function Button(){ return <button>Version ${version}</button> }`,
          },
  }),
})
describe("independent project libraries", () => {
  for (const kind of ["react-vite", "vue-vite"] as const)
    it(`isolates ${kind} edits and exports customized sources`, () => {
      const original = snapshot(1, kind),
        site = createSiteDocument(kind)
      const a = applyLibrary(site, original),
        b = applyLibrary(site, original)
      const path =
        libraryPrefix(id) + (kind === "vue-vite" ? "Button.vue" : "Button.tsx")
      const element = elementsOf(a).find(
        (e) => e.file === path && e.text === "Version 1"
      )!
      const edited = applyTextEdit(a, element.id, "Personnalisé")
      expect(edited.files[path]).toContain("Personnalisé")
      expect(b.files[path]).toContain("Version 1")
      expect(
        original.payload.files[Object.keys(original.payload.files)[0]]
      ).toContain("Version 1")
      expect(strFromU8(unzipSync(exportSite(edited))[path])).toContain(
        "Personnalisé"
      )
      expect(compareLibrary(edited, original)).toEqual([])
      const next = snapshot(2, kind)
      expect(compareLibrary(edited, next)).toEqual([
        expect.objectContaining({ path, conflict: true }),
      ])
      expect(() => applyLibrary(edited, next)).toThrow("Conflit")
      const retained = applyLibrary(edited, next, { [path]: "local" })
      expect(retained.files[path]).toContain("Personnalisé")
      expect(retained.libraries?.[0].snapshot.version).toBe(2)
      expect(
        applyLibrary(edited, next, { [path]: "incoming" }).files[path]
      ).toContain("Version 2")
    })
  it("handles local deletions and upstream deletions without silent overwrite", () => {
    const first = snapshot(),
      installed = applyLibrary(createSiteDocument(), first),
      path = libraryPrefix(id) + "Button.tsx"
    const edited = applySiteProposal(installed, {
      summary: "Personnalisation",
      operations: [
        {
          type: "writeFile",
          path,
          content: "export function Button(){return <button>Local</button>}",
        },
      ],
    })
    const next = {
      ...snapshot(2),
      payload: libraryPayloadSchema.parse({
        framework: "react-vite",
        files: {},
      }),
    }
    expect(() => applyLibrary(edited, next)).toThrow("Conflit")
    expect(
      applyLibrary(edited, next, { [path]: "local" }).files[path]
    ).toContain("Local")
    expect(
      applyLibrary(edited, next, { [path]: "incoming" }).files[path]
    ).toBeUndefined()
    const deleted = structuredClone(installed)
    delete deleted.files[path]
    expect(compareLibrary(deleted, snapshot(2))[0].conflict).toBe(true)
  })
  it("rejects framework mixing", () =>
    expect(() =>
      applyLibrary(createSiteDocument(), snapshot(1, "vue-vite"))
    ).toThrow("framework"))
})
describe("library import", () => {
  it("discovers exports, props and folder structure", () => {
    const payload = payloadFromEntries(
      {
        "ui/src/Button.tsx": strToU8(
          "type Props={ label: string; disabled?: boolean }; export function Button({label}:Props){return <button>{label}</button>}"
        ),
        "ui/package.json": strToU8('{"dependencies":{"clsx":"^2.1.1"}}'),
      },
      "react-vite"
    )
    expect(payload.components[0]).toMatchObject({
      name: "Button",
      path: "src/Button.tsx",
      props: { label: "string", disabled: "boolean (optionnel)" },
    })
    expect(payload.dependencies.clsx).toBe("^2.1.1")
  })
  it("rejects secrets, traversal and non-public dependency specifiers", () => {
    for (const path of [
      "../Button.tsx",
      "src/../../Button.tsx",
      ".env",
      "src/.env",
      "src/constructor/x.ts",
    ])
      expect(() =>
        libraryPayloadSchema.parse({
          framework: "react-vite",
          files: { [path]: "secret" },
        })
      ).toThrow()
    for (const version of [
      "file:../outside",
      "https://example.com/a.tgz",
      "git+ssh://git/repo",
    ])
      expect(() =>
        libraryPayloadSchema.parse({
          framework: "react-vite",
          files: {},
          dependencies: { danger: version },
        })
      ).toThrow()
  })
  it("imports ZIP with matching metadata", async () => {
    const bytes = zipSync({
      "Button.vue": strToU8("<template><button>OK</button></template>"),
    })
    const file = {
      name: "ui.zip",
      size: bytes.length,
      arrayBuffer: async () => bytes.buffer,
    } as File
    expect(
      (await readLibraryFiles([file], "vue-vite")).components[0].name
    ).toBe("Button")
  })
})
