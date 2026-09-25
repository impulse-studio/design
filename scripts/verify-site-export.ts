import { mkdtemp, mkdir, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { execFileSync } from "node:child_process"
import { unzipSync } from "fflate"
import { createSiteDocument } from "../src/features/sites/template"
import {
  applyTextEdit,
  applyVisualEdit,
  applySiteProposal,
  elementsOf,
} from "../src/features/sites/source"
import { exportSite } from "../src/features/sites/export"
let doc = applySiteProposal(createSiteDocument(), {
  summary: "Premier contenu",
  operations: [
    {
      type: "writeFile",
      path: "src/App.tsx",
      content: "export function App(){return <h1>Bienvenue</h1>}",
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
const output = await mkdtemp(join(tmpdir(), "digit-site-export-"))
const bytes = exportSite(doc)
await writeFile(`${output}.zip`, bytes)
for (const [path, content] of Object.entries(unzipSync(bytes))) {
  const target = join(output, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}
execFileSync("pnpm", ["install", "--frozen-lockfile"], {
  cwd: output,
  stdio: "inherit",
})
execFileSync("pnpm", ["build"], { cwd: output, stdio: "inherit" })
console.log(`Verified standalone export: ${output}.zip`)
