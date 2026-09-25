import { analyzeVue } from "./vue"
import { analyzeReact } from "./source-react"
import { sourceHash } from "./source-model"
import type { SourceElement, ParsedSource } from "./source-model"
import { readScenarios } from "./scenarios"
import {
  siteDocumentSchema,
  siteProposalSchema,
  visualEditSchema,
} from "@/validators/sites/document"
import type { SiteDocument, VisualEdit } from "@/validators/sites/document"

export type { SourceElement } from "./source-model"
export type SiteElementStatus = "new" | "modified" | "same"

const analyzeSources = (doc: SiteDocument) => {
  const sources = new Map<string, ParsedSource>()
  for (const [file, code] of Object.entries(doc.files)) {
    if (file.startsWith("src/components/ui/")) continue
    if (file.endsWith(".vue")) sources.set(file, analyzeVue(code, file))
    else if (/\.[jt]sx$/.test(file)) sources.set(file, analyzeReact(code, file))
  }
  return sources
}
export const elementsOf = (doc: SiteDocument): SourceElement[] =>
  [...analyzeSources(doc).values()].flatMap((source) => source.elements)

export const normalizeSources = (input: SiteDocument): SiteDocument => {
  const doc = structuredClone(input)
  const sources = analyzeSources(doc)
  const reserved = new Set(
    [...sources.values()].flatMap((source) =>
      source.elements.map((element) => element.id)
    )
  )
  const used = new Set<string>()
  for (const [file, source] of sources) {
    let index = 0
    doc.files[file] = source.normalize((previous) => {
      if (previous && /^ds-[a-z0-9-]+$/.test(previous) && !used.has(previous)) {
        used.add(previous)
        return previous
      }
      let id: string
      do {
        id = `ds-${sourceHash(file)}-${index++}`
      } while (used.has(id) || reserved.has(id))
      used.add(id)
      return id
    })
  }
  return siteDocumentSchema.parse(doc)
}
const visualCss = (edits: VisualEdit[]) =>
  [...edits]
    .sort(
      (a, b) =>
        ["base", "tablet", "mobile"].indexOf(a.breakpoint) -
        ["base", "tablet", "mobile"].indexOf(b.breakpoint)
    )
    .map((edit) => {
      const declarations = Object.entries(edit.styles)
        .filter(([, value]) => value)
        .map(
          ([key, value]) =>
            `${key.startsWith("--") ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value} !important`
        )
        .join(";")
      const rule = `[data-digi-id="${edit.id}"]{${declarations}}`
      return edit.breakpoint === "base"
        ? rule
        : `@media(max-width:${edit.breakpoint === "mobile" ? 767 : 1023}px){${rule}}`
    })
    .join("\n")
export const applyVisualEdit = (input: SiteDocument, raw: unknown) => {
  const edit = visualEditSchema.parse(raw),
    doc = structuredClone(input)
  if (!elementsOf(doc).some((e) => e.id === edit.id))
    throw new Error("Élément introuvable. Sélectionnez-le à nouveau.")
  const index = doc.visual.findIndex(
    (e) => e.id === edit.id && e.breakpoint === edit.breakpoint
  )
  if (index < 0) doc.visual.push(edit)
  else
    doc.visual[index] = {
      ...edit,
      styles: { ...doc.visual[index].styles, ...edit.styles },
    }
  doc.files["src/visual.css"] = visualCss(doc.visual)
  return siteDocumentSchema.parse(doc)
}
export const applyTextEdit = (
  input: SiteDocument,
  id: string,
  text: string
) => {
  const sources = analyzeSources(input)
  for (const [file, source] of sources) {
    const element = source.elements.find((item) => item.id === id)
    if (!element) continue
    if (element.text === null) break
    const doc = structuredClone(input)
    doc.files[file] = source.editText(id, text)
    return siteDocumentSchema.parse(doc)
  }
  throw new Error(
    "Ce contenu est dynamique. Utilisez le chat pour le modifier."
  )
}
export const isEditableFile = (path: string) =>
  /^src\/.+\.(tsx?|jsx?|vue|css|json)$/.test(path) &&
  !path.startsWith("src/components/ui/") &&
  !["src/base.css", "src/visual.css", "src/main.tsx", "src/main.ts"].includes(
    path
  )
export const applySiteProposal = (input: SiteDocument, raw: unknown) => {
  const proposal = siteProposalSchema.parse(raw),
    doc = structuredClone(input)
  for (const operation of proposal.operations) {
    if (!isEditableFile(operation.path))
      throw new Error(`Fichier protégé : ${operation.path}`)
    if (operation.type === "writeFile")
      doc.files[operation.path] = operation.content
    else if (operation.type === "deleteFile") delete doc.files[operation.path]
    else {
      if (!Object.hasOwn(doc.files, operation.path))
        throw new Error(`Fichier introuvable : ${operation.path}`)
      const content = doc.files[operation.path]
      const first = content.indexOf(operation.oldText)
      if (first < 0 || content.indexOf(operation.oldText, first + 1) >= 0)
        throw new Error(
          `Le texte à remplacer doit apparaître exactement une fois : ${operation.path}`
        )
      doc.files[operation.path] =
        content.slice(0, first) +
        operation.newText +
        content.slice(first + operation.oldText.length)
    }
  }
  if (proposal.routes) doc.routes = proposal.routes
  readScenarios(doc)
  const normalized = normalizeSources(doc)
  normalized.files["src/visual.css"] = visualCss(normalized.visual)
  return siteDocumentSchema.parse(normalized)
}
