import { execFile } from "node:child_process"
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { promisify } from "node:util"
import { siteKindSchema } from "@/validators/sites/kind"
import type { SiteKind } from "@/validators/sites/kind"
import type { SiteDocument } from "@/validators/sites/document"
import { siteDocumentSchema } from "@/validators/sites/document"
import { packageSchema } from "@/validators/sites/package"
import { filePathSchema } from "@/validators/sites/paths"
import { normalizeSources } from "./source"

const execute = promisify(execFile)
const assetTypes: Partial<
  Record<string, SiteDocument["assets"][string]["mime"]>
> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  woff2: "font/woff2",
}

export const createSiteDocument = async (input: SiteKind = "react-vite") => {
  const kind = siteKindSchema.parse(input)
  const directory = await mkdtemp(join(tmpdir(), "digit-vite-"))
  try {
    await execute(
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
      { cwd: directory, timeout: 120_000, maxBuffer: 1_000_000 }
    )
    const root = join(directory, "site")
    const files: Record<string, string> = {}
    const assets: SiteDocument["assets"] = {}
    const visit = async (relative = "") => {
      for (const entry of await readdir(join(root, relative), {
        withFileTypes: true,
      })) {
        if (entry.name.startsWith(".") || entry.name === "node_modules")
          continue
        const path = relative ? `${relative}/${entry.name}` : entry.name
        if (entry.isDirectory()) await visit(path)
        else if (entry.isFile()) {
          filePathSchema.parse(path)
          const content = await readFile(join(root, path))
          const mime = assetTypes[path.split(".").at(-1) ?? ""]
          if (mime) assets[path] = { mime, base64: content.toString("base64") }
          else files[path] = content.toString("utf8")
        }
      }
    }
    await visit()
    const pkg = packageSchema.parse(JSON.parse(files["package.json"]))
    const main = kind === "vue-vite" ? "src/main.ts" : "src/main.tsx"
    if (!files[main])
      throw new Error(
        "Le projet Vite généré ne contient pas son point d’entrée."
      )
    files["src/visual.css"] = ""
    files[main] += '\nimport "./visual.css"\n'
    return normalizeSources(
      siteDocumentSchema.parse({
        kind,
        version: 1,
        files,
        assets,
        dependencies: pkg.dependencies,
        routes: [{ path: "/", name: "Accueil" }],
        visual: [],
      })
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
