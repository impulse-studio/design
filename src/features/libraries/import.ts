import { strFromU8, unzipSync } from "fflate"
import { z } from "zod"
import { libraryPayloadSchema, libraryComponentSchema } from "./schema"
import type { LibraryPayload } from "./schema"
import { parseSource } from "@/features/sites/source"
import { parse as parseVue } from "@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js"
import * as t from "@babel/types"

const manifestSchema = z.object({ components: z.array(libraryComponentSchema).default([]) })
const packageSchema = z.object({ dependencies: z.record(z.string(), z.string()).default({}), peerDependencies: z.record(z.string(), z.string()).default({}) })
const mime: Record<string,string> = {png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",svg:"image/svg+xml",woff2:"font/woff2"}
export const discoverComponents = (files: Record<string,string>, framework: LibraryPayload["framework"]) => {
  const components: LibraryPayload["components"] = []
  for (const [path, code] of Object.entries(files)) {
    if (framework === "vue-vite" && path.endsWith(".vue")) {
      const {descriptor,errors} = parseVue(code, {filename:path})
      if (errors.length) throw new Error(`Composant Vue invalide : ${path}`)
      const props: Record<string,string> = {}
      const script = descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ""
      const match = script.match(/defineProps\s*<\s*\{([\s\S]*?)\}\s*>/)
      for (const item of match?.[1].matchAll(/(\w+)(\?)?\s*:\s*([^;\n]+)/g) ?? []) props[item[1]] = `${item[3].trim()}${item[2] ? " (optionnel)" : ""}`
      components.push({ name:path.split("/").at(-1)!.replace(/\.vue$/,""), path, exportName:"default", description:"", props })
    } else if (framework === "react-vite" && /\.[jt]sx$/.test(path)) {
      const ast = parseSource(code)
      const props: Record<string,string> = {}
      for (const node of ast.program.body) {
        const decl = t.isExportNamedDeclaration(node) ? node.declaration : node
        const members = t.isTSInterfaceDeclaration(decl) ? decl.body.body : t.isTSTypeAliasDeclaration(decl) && t.isTSTypeLiteral(decl.typeAnnotation) ? decl.typeAnnotation.members : []
        for (const item of members) if (t.isTSPropertySignature(item) && t.isIdentifier(item.key)) props[item.key.name] = `${code.slice(item.typeAnnotation?.start ?? 0, item.typeAnnotation?.end ?? 0).replace(/^:\s*/, "")}${item.optional ? " (optionnel)" : ""}`
      }
      for (const node of ast.program.body) {
        if (t.isExportDefaultDeclaration(node)) components.push({name:path.split("/").at(-1)!.replace(/\.[jt]sx$/,""),path,exportName:"default",description:"",props})
        if (!t.isExportNamedDeclaration(node)) continue
        const names = t.isFunctionDeclaration(node.declaration) ? [node.declaration.id?.name] : t.isVariableDeclaration(node.declaration) ? node.declaration.declarations.map(d => t.isIdentifier(d.id) ? d.id.name : undefined) : []
        for (const name of names) if (name && /^[A-Z]/.test(name)) components.push({name,path,exportName:name,description:"",props})
      }
    }
  }
  return components
}
export const payloadFromEntries = (raw: Record<string, Uint8Array>, framework: LibraryPayload["framework"]) => {
  const files: Record<string,string> = {}, assets: LibraryPayload["assets"] = {}
  const names = Object.keys(raw)
  if (names.length > 250 || Object.values(raw).reduce((n,b)=>n+b.byteLength,0)>10_000_000) throw new Error("Import limité à 250 fichiers et 10 Mo.")
  const root = names[0]?.split("/")[0]
  const strip = root && names.every(p=>p.startsWith(`${root}/`)) ? `${root}/` : ""
  for (const [name, bytes] of Object.entries(raw)) {
    const path = name.slice(strip.length)
    if (Object.hasOwn(files,path) || Object.hasOwn(assets,path)) throw new Error(`Chemin dupliqué : ${path}`)
    const type = mime[path.split(".").at(-1) ?? ""]
    if (type) { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); assets[path] = {mime:type as LibraryPayload["assets"][string]["mime"],base64:btoa(binary)} }
    else if (/\.(vue|[jt]sx?|css|json)$/.test(path)) files[path] = strFromU8(bytes)
    else throw new Error(`Format non pris en charge : ${path}`)
  }
  const pkg = files["package.json"] ? packageSchema.parse(JSON.parse(files["package.json"])) : { dependencies:{}, peerDependencies:{} }
  const manifest = files["studio.library.json"] ? manifestSchema.parse(JSON.parse(files["studio.library.json"])) : null
  return libraryPayloadSchema.parse({framework,files,assets,dependencies:{...pkg.peerDependencies,...pkg.dependencies},components:manifest?.components.length ? manifest.components : discoverComponents(files,framework)})
}
export const readLibraryFiles = async (input: File[], framework: LibraryPayload["framework"]) => {
  const entries: Record<string,Uint8Array> = {}
  let size=0
  for (const file of input) {
    size += file.size
    if (size>10_000_000) throw new Error("Import limité à 10 Mo.")
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (file.name.endsWith(".zip")) {
      let total=0, count=0
      const unpacked = unzipSync(bytes, {filter: entry => {
        if(entry.name.endsWith("/")) return false
        total+=entry.originalSize; count++
        if(total>10_000_000 || count>250) throw new Error("Archive trop volumineuse.")
        return true
      }})
      for (const [path,data] of Object.entries(unpacked)) { if(Object.hasOwn(entries,path)) throw new Error(`Chemin dupliqué : ${path}`); entries[path]=data }
    } else {
      const path=file.webkitRelativePath || file.name
      if(Object.hasOwn(entries,path)) throw new Error(`Chemin dupliqué : ${path}`)
      entries[path]=bytes
    }
  }
  return payloadFromEntries(entries,framework)
}

export const droppedLibraryFiles = async (items: DataTransferItemList): Promise<File[]> => {
  const result: File[]=[]
  const visit=async(entry:FileSystemEntry,path=""):Promise<void>=>{
    if(entry.isFile) {
      const file=await new Promise<File>((resolve,reject)=>(entry as FileSystemFileEntry).file(resolve,reject))
      Object.defineProperty(file,"webkitRelativePath",{value:path+file.name})
      result.push(file)
      if(result.length>250) throw new Error("Import limité à 250 fichiers.")
    } else if(entry.isDirectory) {
      const reader=(entry as FileSystemDirectoryEntry).createReader()
      for(;;) {const children=await new Promise<FileSystemEntry[]>((resolve,reject)=>reader.readEntries(resolve,reject));if(!children.length) break;for(const child of children) await visit(child,path+entry.name+"/")}
    }
  }
  const entries=Array.from(items).map(item=>({entry:item.webkitGetAsEntry?.(),file:item.getAsFile()}))
  for(const item of entries) {if(item.entry) await visit(item.entry);else if(item.file) result.push(item.file)}
  return result
}
