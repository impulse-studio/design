import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { execFileSync } from "node:child_process"
import { unzipSync } from "fflate"
import { createSiteDocument } from "../../src/features/sites/scaffold.server"
import {
  applyTextEdit,
  applyVisualEdit,
  applySiteProposal,
  elementsOf,
} from "../../src/features/sites/source"
import { exportSite } from "../../src/features/sites/export"

const createExample = async () => {
  let doc = applySiteProposal(await createSiteDocument(), {
    summary: "Premier contenu",
    operations: [
      {
        type: "writeFile",
        path: "src/App.tsx",
        content: "export default function App(){return <h1>Bienvenue</h1>}",
      },
    ],
  })
  const title = elementsOf(doc).find((e) => e.tag === "h1")!
  doc = applyTextEdit(doc, title.id, "Site autonome validé")
  doc = applyVisualEdit(doc, {
    id: title.id,
    breakpoint: "mobile",
    styles: { padding: "12px", gap: "16px" },
  })
  doc = applySiteProposal(doc, {
    summary: "Ajout libre",
    operations: [
      {
        type: "writeFile",
        path: "src/components/Welcome.tsx",
        content: "export function Welcome(){return <p>Un composant libre</p>}",
      },
    ],
  })

  return exportSite(doc)
}
const output = await mkdtemp(join(tmpdir(), "digit-site-export-"))
const bytes = process.argv[2]
  ? await readFile(process.argv[2])
  : await createExample()
await writeFile(`${output}.zip`, bytes)
const files = unzipSync(bytes)
for (const [path, content] of Object.entries(files)) {
  if (
    path.startsWith("/") ||
    path.split("/").includes("..") ||
    path.includes("\\")
  )
    throw new Error(`Unsafe archive path: ${path}`)
  const target = join(output, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}
const locked = Object.hasOwn(files, "package-lock.json")
execFileSync("npm", [locked ? "ci" : "install", "--no-audit", "--no-fund"], {
  cwd: output,
  stdio: "inherit",
})
execFileSync("npm", ["run", "build"], {
  cwd: output,
  stdio: "inherit",
})
console.log(`Verified standalone export: ${output}.zip`)
