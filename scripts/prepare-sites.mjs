import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
import { readFile, writeFile, mkdir, readdir, copyFile } from "node:fs/promises"
import { resolve, relative } from "node:path"
import { build } from "esbuild"
const root = resolve("site-template")
await mkdir("public/site-runtime", { recursive: true })
const pkg = JSON.parse(await readFile(`${root}/package.json`, "utf8"))
const imports = [
  "vue",
  "react",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-dom",
  "react-dom/client",
  "@tanstack/react-router",
  "@tanstack/react-form",
  "zod",
  "@remixicon/react",
  "class-variance-authority",
  "cn",
  // Keep runtime support for sites created with the previous template.
  "@base-ui/react/button",
  "@base-ui/react/checkbox",
  "@base-ui/react/dialog",
  "@base-ui/react/input",
  "@base-ui/react/menu",
  "@base-ui/react/merge-props",
  "@base-ui/react/select",
  "@base-ui/react/separator",
  "@base-ui/react/tabs",
  "@base-ui/react/use-render",
]
const files = {},
  assets = {}
const visit = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name)) continue
    const path = resolve(dir, entry.name),
      key = relative(root, path)
    if (entry.isDirectory()) await visit(path)
    else if (key.startsWith("src/assets/"))
      assets[key] = {
        mime: "font/woff2",
        base64: (await readFile(path)).toString("base64"),
      }
    else if (key !== "theme.css") {
      const content = await readFile(path, "utf8")
      files[key] = content
      for (const match of content.matchAll(
        /from\s+["'](@base-ui\/react\/[^"']+)["']/g
      ))
        imports.push(match[1])
    }
  }
}
await visit(root)
const entries = [...new Set(imports)],
  entryPoints = {}
for (let i = 0; i < entries.length; i++) {
  const path = resolve("node_modules/.cache/digit-sites", `dep-${i}.js`)
  await mkdir(resolve("node_modules/.cache/digit-sites"), { recursive: true })
  const names = Object.keys(require(entries[i])).filter(
    (name) => name !== "default" && /^[A-Za-z_$][\w$]*$/.test(name)
  )
  await writeFile(
    path,
    `export { ${names.join(",")} } from ${JSON.stringify(entries[i])};${entries[i] === "react" || entries[i] === "react-dom" ? `import value from ${JSON.stringify(entries[i])}; export default value;` : ""}`
  )
  entryPoints[`dep-${i}`] = path
}
const vendor = await build({
  entryPoints,
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  write: false,
  outdir: "site-vendor",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
})
const modules = Object.fromEntries(
  vendor.outputFiles.map((f) => [
    relative(resolve("site-vendor"), f.path),
    f.text,
  ])
)
await writeFile(
  "public/site-runtime/modules.json",
  JSON.stringify({
    imports: Object.fromEntries(
      entries.map((entry, i) => [entry, `dep-${i}.js`])
    ),
    modules,
  })
)
await copyFile(
  "node_modules/esbuild-wasm/esbuild.wasm",
  "public/site-runtime/esbuild.wasm"
)
await mkdir("src/generated", { recursive: true })
await writeFile(
  "src/generated/site-template.json",
  JSON.stringify({
    kind: "react-vite",
    version: 1,
    files,
    assets,
    dependencies: pkg.dependencies,
    routes: [{ path: "/", name: "Accueil" }],
    visual: [],
  })
)
console.log(
  `Site template: ${Object.keys(files).length} files, ${entries.length} runtime modules.`
)
