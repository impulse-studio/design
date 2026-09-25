import { access, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { elementsOf } from "./source"
import { createSiteDocument } from "./scaffold.server"

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }))
vi.mock("node:child_process", () => ({
  execFile: execute,
  default: { execFile: execute },
}))

beforeEach(() => {
  execute.mockReset()
  execute.mockImplementation(
    (
      _command: string,
      args: string[],
      options: { cwd: string },
      callback: (error: Error | null, stdout: string, stderr: string) => void
    ) => {
      const vue = args.includes("vue-ts")
      const root = join(options.cwd, "site")
      const files = {
        "package.json": JSON.stringify({
          dependencies: vue
            ? { vue: "latest" }
            : { react: "latest", "react-dom": "latest" },
        }),
        "index.html": `<div id="${vue ? "app" : "root"}"></div>`,
        [vue ? "src/main.ts" : "src/main.tsx"]: vue
          ? 'import App from "./App.vue"'
          : 'import App from "./App"',
        [vue ? "src/App.vue" : "src/App.tsx"]: vue
          ? "<template><h1>Vite + Vue</h1></template>"
          : "export default function App(){return <h1>Vite + React</h1>}",
        "public/vite.svg": '<svg xmlns="http://www.w3.org/2000/svg"/>',
        ".gitignore": "node_modules",
      }
      void (async () => {
        await mkdir(join(root, "src"), { recursive: true })
        await mkdir(join(root, "public"), { recursive: true })
        await writeFile(
          join(root, "public/hero.png"),
          Buffer.from([137, 80, 78, 71, 255, 0])
        )
        for (const [path, content] of Object.entries(files))
          await writeFile(join(root, path), content)
      })().then(
        () => callback(null, "", ""),
        (error: Error) => callback(error, "", "")
      )
    }
  )
})

describe("official Vite project creation", () => {
  it.each(["react-vite", "vue-vite"] as const)(
    "scaffolds %s without installing or starting a server",
    async (kind) => {
      const doc = await createSiteDocument(kind)
      expect(execute).toHaveBeenCalledWith(
        "npm",
        [
          "create",
          "--yes",
          "vite@latest",
          "site",
          "--",
          "--template",
          kind === "vue-vite" ? "vue-ts" : "react-ts",
          "--no-interactive",
          "--no-immediate",
        ],
        expect.objectContaining({ timeout: 120_000 }),
        expect.any(Function)
      )
      expect(doc.kind).toBe(kind)
      expect(doc.files["public/vite.svg"]).toContain("<svg")
      expect(doc.files[".gitignore"]).toBeUndefined()
      expect(
        Buffer.from(doc.assets["public/hero.png"].base64, "base64")
      ).toEqual(Buffer.from([137, 80, 78, 71, 255, 0]))
      expect(
        doc.files[kind === "vue-vite" ? "src/main.ts" : "src/main.tsx"]
      ).toContain('import "./visual.css"')
      expect(elementsOf(doc).some((element) => element.tag === "h1")).toBe(true)
      await expect(access(execute.mock.calls[0][2].cwd)).rejects.toThrow()
    }
  )

  it("cleans the temporary directory and propagates CLI failures", async () => {
    execute.mockImplementationOnce((_command, _args, _options, callback) =>
      callback(new Error("Registry unavailable"), "", "")
    )
    await expect(createSiteDocument()).rejects.toThrow("Registry unavailable")
    await expect(access(execute.mock.calls[0][2].cwd)).rejects.toThrow()
  })

  it("rejects unsupported frameworks before executing a command", async () => {
    await expect(createSiteDocument("invalid" as never)).rejects.toThrow()
    expect(execute).not.toHaveBeenCalled()
  })
})
