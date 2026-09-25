import { afterEach, describe, expect, it } from "vitest"
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { strToU8, zipSync } from "fflate"
import { readLocalLibrary } from "../../../scripts/libraries/library-files"
import { readLibraryFiles } from "./import"
import { payloadFromEntries } from "./ingestion"

const roots: string[] = []
const inputFile = (name: string, bytes: Uint8Array, relativePath = "") => {
  const file = new File([new Uint8Array(bytes)], name)
  Object.defineProperty(file, "arrayBuffer", {
    value: async () => new Uint8Array(bytes).buffer,
  })
  Object.defineProperty(file, "webkitRelativePath", { value: relativePath })
  return file
}
afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  )
})

describe("shared library ingestion", () => {
  for (const framework of ["react-vite", "vue-vite"] as const)
    it(`produces the same ${framework} payload from a folder, browser files and ZIP`, async () => {
      const root = await mkdtemp(join(tmpdir(), "digit-library-"))
      roots.push(root)
      const component =
        framework === "react-vite" ? "src/Button.tsx" : "src/Button.vue"
      const files = {
        [component]:
          framework === "react-vite"
            ? "type Props = { label?: string }; export function Button(){return <button>OK</button>}"
            : '<script setup lang="ts">defineProps<{label?:string}>()</script><template><button>OK</button></template>',
        "package.json": '{"dependencies":{"clsx":"2.1.1"}}',
        "assets/icon.svg": '<svg xmlns="http://www.w3.org/2000/svg"/>',
        "node_modules/ignored.js": "ignored",
        ".env": "excluded",
        "secrets/token.json": "excluded",
        "README.md": "unsupported",
      }
      for (const [path, content] of Object.entries(files)) {
        await mkdir(dirname(join(root, path)), { recursive: true })
        await writeFile(join(root, path), content)
      }
      await symlink(join(root, component), join(root, "Linked.tsx"))
      const local = await readLocalLibrary(root, framework)
      const browser = await readLibraryFiles(
        Object.entries(files).map(([path, content]) =>
          inputFile(
            path.split("/").at(-1)!,
            strToU8(content),
            `library/${path}`
          )
        ),
        framework
      )
      const zip = zipSync(
        Object.fromEntries(
          Object.entries(files).map(([path, content]) => [
            `library/${path}`,
            strToU8(content),
          ])
        )
      )
      const archive = await readLibraryFiles(
        [inputFile("library.zip", zip)],
        framework
      )
      expect(browser).toEqual(local)
      expect(archive).toEqual(local)
      expect(local.components[0]).toMatchObject({
        name: "Button",
        path: component,
        props: { label: "string (optionnel)" },
      })
      expect(Object.keys(local.files)).toEqual(["package.json", component])
      expect(local.assets["assets/icon.svg"].mime).toBe("image/svg+xml")
    })
  it("rejects duplicate selections and traversal before they reach a payload", async () => {
    const file = inputFile(
      "Button.tsx",
      strToU8("export const Button = () => <button/>")
    )
    await expect(readLibraryFiles([file, file], "react-vite")).rejects.toThrow(
      "dupliqué"
    )
    for (const path of [
      "../Button.tsx",
      "/Button.tsx",
      "src/constructor/Button.tsx",
      "src\\Button.tsx",
    ])
      expect(() =>
        payloadFromEntries({ [path]: strToU8("source") }, "react-vite")
      ).toThrow("Chemin interdit")
  })
  it("rejects a browser import when every selected entry is ignored", async () => {
    await expect(
      readLibraryFiles(
        [inputFile("README.md", strToU8("Documentation uniquement"))],
        "react-vite"
      )
    ).rejects.toThrow("Aucun fichier de bibliothèque pris en charge")
  })
  it("enforces uncompressed ZIP limits before extracting a large entry", async () => {
    const bytes = zipSync({ "large.ts": new Uint8Array(10_000_001) })
    await expect(
      readLibraryFiles([inputFile("library.zip", bytes)], "react-vite")
    ).rejects.toThrow("volumineuse")
  })
  it("validates explicit metadata instead of trusting the connector", () => {
    expect(() =>
      payloadFromEntries(
        {
          "package.json": strToU8(
            '{"dependencies":{"unsafe":"file:../secret"}}'
          ),
        },
        "react-vite"
      )
    ).toThrow()
    expect(() =>
      payloadFromEntries(
        {
          "studio.library.json": strToU8(
            '{"components":[{"name":"Missing","path":"Missing.tsx","exportName":"default"}]}'
          ),
        },
        "react-vite"
      )
    ).toThrow("absent")
  })
})
