import { compileVue } from "./vue"
import type { BuildOptions, Plugin } from "esbuild-wasm"
import type { SiteDocument } from "./schema"

export type RuntimeModules = {
  imports: Record<string, string>
  modules: Record<string, string>
}
const normalize = (path: string) => {
  const parts: string[] = []
  for (const part of path.split("/")) {
    if (part === "..") parts.pop()
    else if (part && part !== ".") parts.push(part)
  }
  return parts.join("/")
}
export const projectPlugin = (
  doc: SiteDocument,
  runtime: RuntimeModules,
  extra: Record<string, string> = {}
): Plugin => ({
  name: "digit-project",
  setup(build) {
    const files = { ...doc.files, ...extra }
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.namespace === "library-vendor") {
        if (runtime.imports[args.path]) return {path:runtime.imports[args.path],namespace:"vendor"}
        const id=args.importer.split("/")[0]
        const lib=doc.libraries?.find(b=>b.snapshot.libraryId===id)?.snapshot.runtime
        const local=normalize(`${args.importer.split("/").slice(1,-1).join("/")}/${args.path}`)
        if(lib && Object.hasOwn(lib.modules,local)) return {path:`${id}/${local}`,namespace:"library-vendor"}
        throw new Error(`Module de bibliothèque absent : ${args.path}`)
      }
      const libraryId=args.importer.match(/^src\/libraries\/([^/]+)\//)?.[1]
      const library=doc.libraries?.find(b=>b.snapshot.libraryId===libraryId)?.snapshot
      if(library?.runtime?.imports[args.path]) return {path:`${library.libraryId}/${library.runtime.imports[args.path]}`,namespace:"library-vendor"}
      if (args.namespace === "vendor") {
        const path = normalize(args.path)
        if (Object.hasOwn(runtime.modules, path))
          return { path, namespace: "vendor" }
        throw new Error(`Module absent : ${args.path}`)
      }
      if (runtime.imports[args.path])
        return { path: runtime.imports[args.path], namespace: "vendor" }
      const base = args.path.startsWith("@/")
        ? args.path.slice(2)
        : args.path.startsWith(".")
          ? `${args.importer.split("/").slice(0, -1).join("/")}/${args.path}`
          : args.path
      const path = normalize(args.path.startsWith("@/") ? `src/${base}` : base)
      for (const candidate of [
        path,
        `${path}.vue`,
        `${path}.jsx`,
        `${path}.tsx`,
        `${path}.ts`,
        `${path}.js`,
        `${path}.json`,
        `${path}/index.vue`,
        `${path}/index.js`,
        `${path}/index.tsx`,
        `${path}/index.ts`,
      ]) {
        if (Object.hasOwn(files, candidate))
          return { path: candidate, namespace: "project" }
        if (Object.hasOwn(doc.assets, candidate))
          return { path: candidate, namespace: "asset" }
      }
      throw new Error(
        `Import indisponible : ${args.path}. Utilisez les dépendances du socle ou un fichier du projet.`
      )
    })
    build.onLoad({filter:/.*/,namespace:"library-vendor"},args=>{
      const [id,...parts]=args.path.split("/")
      const contents=doc.libraries?.find(b=>b.snapshot.libraryId===id)?.snapshot.runtime?.modules[parts.join("/")]
      if(contents===undefined) throw new Error(`Module absent : ${args.path}`)
      return {contents,loader:"js"}
    })
    build.onLoad({ filter: /.*/, namespace: "vendor" }, (args) => ({
      contents: runtime.modules[args.path],
      loader: "js",
    }))
    build.onLoad({ filter: /.*/, namespace: "asset" }, (args) => ({
      contents: `data:${doc.assets[args.path].mime};base64,${doc.assets[args.path].base64}`,
      loader: "text",
    }))
    build.onLoad({ filter: /.*/, namespace: "project" }, (args) => {
      const extension = args.path.split(".").at(-1)
      if (extension === "vue") return { contents: compileVue(files[args.path], args.path), loader: "ts" }
      if (extension === "css") {
        const css = files[args.path].replace(
          /url\(["']?([^"')]+)["']?\)/g,
          (match, value: string) => {
            const asset =
              doc.assets[
                normalize(
                  `${args.path.split("/").slice(0, -1).join("/")}/${value}`
                )
              ]
            return Object.hasOwn(
              doc.assets,
              normalize(
                `${args.path.split("/").slice(0, -1).join("/")}/${value}`
              )
            )
              ? `url("data:${asset.mime};base64,${asset.base64}")`
              : match
          }
        )
        return {
          contents: `{const style=document.createElement('style');style.textContent=${JSON.stringify(css)};document.head.appendChild(style)}`,
          loader: "js",
        }
      }
      return {
        contents: files[args.path],
        loader:
          extension === "jsx" ? "jsx" : extension === "tsx"
            ? "tsx"
            : extension === "ts"
              ? "ts"
              : extension === "json"
                ? "json"
                : "js",
      }
    })
  },
})
export const compileOptions = (
  doc: SiteDocument,
  runtime: RuntimeModules,
  extra: Record<string, string> = {}
): BuildOptions => ({
  entryPoints: [extra["studio-entry.ts"] ? "studio-entry.ts" : (doc.kind === "vue-vite" ? "src/main.ts" : "src/main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  define: {
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "false",
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.MODE": '"studio"',
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
    "import.meta.env.BASE_URL": '"/"',
  },
  plugins: [projectPlugin(doc, runtime, extra)],
  logLevel: "silent",
})
