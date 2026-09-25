import { manifestSchema, packageSchema } from "@/validators/libraries/ingestion"
import { strFromU8 } from "fflate"

import { libraryPayloadSchema } from "@/validators/libraries/payload"
import type { LibraryPayload } from "@/validators/libraries/payload"
import { parseSource } from "@/features/sites/source-react"
import { parse as parseVue } from "@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js"
import * as t from "@babel/types"
import {
  entryKind,
  createEntryCollector,
  unwrapLibraryEntries,
} from "./entries"

export const discoverComponents = (
  files: Record<string, string>,
  framework: LibraryPayload["framework"]
) => {
  const components: LibraryPayload["components"] = []
  for (const [path, code] of Object.entries(files)) {
    if (framework === "vue-vite" && path.endsWith(".vue")) {
      const { descriptor, errors } = parseVue(code, { filename: path })
      if (errors.length) throw new Error(`Composant Vue invalide : ${path}`)
      const props: Record<string, string> = {}
      const script =
        descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ""
      const match = script.match(/defineProps\s*<\s*\{([\s\S]*?)\}\s*>/)
      for (const item of match?.[1].matchAll(/(\w+)(\?)?\s*:\s*([^;\n]+)/g) ??
        [])
        props[item[1]] = `${item[3].trim()}${item[2] ? " (optionnel)" : ""}`
      components.push({
        name: path
          .split("/")
          .at(-1)!
          .replace(/\.vue$/, ""),
        path,
        exportName: "default",
        description: "",
        props,
      })
    } else if (framework === "react-vite" && /\.[jt]sx$/.test(path)) {
      const ast = parseSource(code)
      const props: Record<string, string> = {}
      for (const node of ast.program.body) {
        const decl = t.isExportNamedDeclaration(node) ? node.declaration : node
        const members = t.isTSInterfaceDeclaration(decl)
          ? decl.body.body
          : t.isTSTypeAliasDeclaration(decl) &&
              t.isTSTypeLiteral(decl.typeAnnotation)
            ? decl.typeAnnotation.members
            : []
        for (const item of members)
          if (t.isTSPropertySignature(item) && t.isIdentifier(item.key))
            props[item.key.name] =
              `${code.slice(item.typeAnnotation?.start ?? 0, item.typeAnnotation?.end ?? 0).replace(/^:\s*/, "")}${item.optional ? " (optionnel)" : ""}`
      }
      for (const node of ast.program.body) {
        if (t.isExportDefaultDeclaration(node))
          components.push({
            name: path
              .split("/")
              .at(-1)!
              .replace(/\.[jt]sx$/, ""),
            path,
            exportName: "default",
            description: "",
            props,
          })
        if (!t.isExportNamedDeclaration(node)) continue
        const names = t.isFunctionDeclaration(node.declaration)
          ? [node.declaration.id?.name]
          : t.isVariableDeclaration(node.declaration)
            ? node.declaration.declarations.map((d) =>
                t.isIdentifier(d.id) ? d.id.name : undefined
              )
            : []
        for (const name of names)
          if (name && /^[A-Z]/.test(name))
            components.push({
              name,
              path,
              exportName: name,
              description: "",
              props,
            })
      }
    }
  }
  return components
}
export const payloadFromEntries = (
  raw: Record<string, Uint8Array>,
  framework: LibraryPayload["framework"],
  { stripRoot = true }: { stripRoot?: boolean } = {}
) => {
  const files: Record<string, string> = {},
    assets: LibraryPayload["assets"] = {}
  const collector = createEntryCollector()
  for (const [path, bytes] of Object.entries(raw)) collector.add(path, bytes)
  const entries = stripRoot
    ? unwrapLibraryEntries(collector.entries)
    : collector.entries
  for (const [path, bytes] of Object.entries(entries)) {
    if (Object.hasOwn(files, path) || Object.hasOwn(assets, path))
      throw new Error(`Chemin dupliqué : ${path}`)
    const type = entryKind(path)
    if (type && type !== "text") {
      let binary = ""
      for (const byte of bytes) binary += String.fromCharCode(byte)
      assets[path] = { mime: type, base64: btoa(binary) }
    } else if (type === "text") files[path] = strFromU8(bytes)
    else throw new Error(`Format non pris en charge : ${path}`)
  }
  const pkg = files["package.json"]
    ? packageSchema.parse(JSON.parse(files["package.json"]))
    : { dependencies: {}, peerDependencies: {} }
  const manifest = files["studio.library.json"]
    ? manifestSchema.parse(JSON.parse(files["studio.library.json"]))
    : null
  return libraryPayloadSchema.parse({
    framework,
    files,
    assets,
    dependencies: { ...pkg.peerDependencies, ...pkg.dependencies },
    components: manifest?.components.length
      ? manifest.components
      : discoverComponents(files, framework),
  })
}
