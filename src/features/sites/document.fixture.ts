import type { SiteKind } from "@/validators/sites/kind"
import { siteDocumentSchema } from "@/validators/sites/document"
import { normalizeSources } from "./source"

/** Minimal document for unit tests; production projects are created by create-vite. */
export const createSiteDocument = (kind: SiteKind = "react-vite") => {
  const vue = kind === "vue-vite"
  const dependencies = vue
    ? { vue: "^3.5.0" }
    : { react: "^19.0.0", "react-dom": "^19.0.0" }
  return normalizeSources(
    siteDocumentSchema.parse({
      kind,
      version: 1,
      files: {
        "package.json": JSON.stringify({
          private: true,
          type: "module",
          scripts: { dev: "vite", build: "vite build" },
          dependencies,
        }),
        "index.html": '<div id="root"></div>',
        "vite.config.ts": "export default {}",
        [vue ? "src/main.ts" : "src/main.tsx"]: 'import "./visual.css"',
        [vue ? "src/App.vue" : "src/App.tsx"]: vue
          ? "<template><main /></template>"
          : "export function App(){return null}",
        "src/styles.css": "",
        "src/visual.css": "",
        "README.md": "# Test project\n\npnpm install\npnpm dev\npnpm build\n",
      },
      assets: {},
      dependencies,
      routes: [{ path: "/", name: "Accueil" }],
      visual: [],
    })
  )
}
