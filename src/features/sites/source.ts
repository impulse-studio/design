import { vueElements, normalizeVue, editVueText } from "./vue"
import { readScenarios } from "./scenarios"
import { parse } from "@babel/parser"
import traverseModule from "@babel/traverse"
import generateModule from "@babel/generator"
import * as t from "@babel/types"
import {
  siteDocumentSchema,
  siteProposalSchema,
  visualEditSchema,
} from "./schema"
import type { SiteDocument, VisualEdit } from "./schema"

const traverse =
  typeof traverseModule === "function"
    ? traverseModule
    : (traverseModule as unknown as { default: typeof traverseModule }).default
const generate =
  typeof generateModule === "function"
    ? generateModule
    : (generateModule as unknown as { default: typeof generateModule }).default
export const parseSource = (code: string) =>
  parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] })
const idOf = (element: t.JSXOpeningElement) => {
  const attribute = element.attributes.find(
    (a) =>
      t.isJSXAttribute(a) && t.isJSXIdentifier(a.name, { name: "data-digi-id" })
  )
  return attribute &&
    t.isJSXAttribute(attribute) &&
    t.isStringLiteral(attribute.value)
    ? attribute.value.value
    : null
}
const hash = (text: string) => {
  let value = 2166136261
  for (const char of text)
    value = Math.imul(value ^ char.charCodeAt(0), 16777619)
  return (value >>> 0).toString(36)
}
export type SourceElement = {
  id: string
  file: string
  tag: string
  text: string | null
  owner: string | null
  isOwnerRoot?: boolean
  kind: "html" | "component"
  line: number | null
  signature: string
}
export type SiteElementStatus = "new" | "modified" | "same"
export const elementsOf = (doc: SiteDocument): SourceElement[] => {
  const elements: SourceElement[] = []
  for (const [file, code] of Object.entries(doc.files)) {
    if (file.endsWith(".vue")) { elements.push(...vueElements(code, file)); continue }
    if (!file.endsWith(".tsx") || file.startsWith("src/components/ui/"))
      continue
    traverse(parseSource(code), {
      JSXElement(path) {
        const id = idOf(path.node.openingElement)
        if (!id) return
        const children = path.node.children
        let owner: string | null = null
        let hasJsxAncestor = false
        let parent: typeof path.parentPath | null = path.parentPath
        while (parent && !owner) {
          if (parent.isJSXElement()) hasJsxAncestor = true
          if (
            parent.isFunctionDeclaration() &&
            parent.node.id &&
            /^[A-Z]/.test(parent.node.id.name)
          )
            owner = parent.node.id.name
          else if (
            parent.isFunctionExpression() &&
            parent.node.id &&
            /^[A-Z]/.test(parent.node.id.name)
          )
            owner = parent.node.id.name
          else if (
            parent.isVariableDeclarator() &&
            t.isIdentifier(parent.node.id) &&
            /^[A-Z]/.test(parent.node.id.name)
          )
            owner = parent.node.id.name
          parent = parent.parentPath
        }
        const tag = t.isJSXIdentifier(path.node.openingElement.name)
          ? path.node.openingElement.name.name
          : generate(path.node.openingElement.name).code
        elements.push({
          id,
          file,
          tag,
          owner,
          isOwnerRoot: Boolean(owner) && !hasJsxAncestor,
          kind: /^[A-Z]/.test(tag) ? "component" : "html",
          line: path.node.loc?.start.line ?? null,
          signature: hash(generate(path.node).code),
          text:
            children.length > 0 && children.every((c) => t.isJSXText(c))
              ? children
                  .map((c) => (t.isJSXText(c) ? c.value : ""))
                  .join("")
                  .trim()
              : null,
        })
      },
    })
  }
  return elements
}
export const normalizeSources = (input: SiteDocument): SiteDocument => {
  const doc = structuredClone(input),
    ids = new Set<string>(),
    reserved = new Set(elementsOf(input).map((e) => e.id))
  for (const [file, code] of Object.entries(doc.files)) {
    if (file.endsWith(".vue")) { doc.files[file] = normalizeVue(code, file, ids, reserved); continue }
    if (!file.endsWith(".tsx") || file.startsWith("src/components/ui/"))
      continue
    const ast = parseSource(code)
    let index = 0
    const edits = { changed: false }
    traverse(ast, {
      JSXOpeningElement(path) {
        const name = t.isJSXIdentifier(path.node.name)
          ? path.node.name.name
          : t.isJSXMemberExpression(path.node.name)
            ? generate(path.node.name).code
            : null
        if (
          !name ||
          ["Fragment", "Suspense", "StrictMode"].includes(name) ||
          /\.(Fragment|Suspense|StrictMode)$/.test(name)
        )
          return
        const previous = idOf(path.node)
        if (
          previous &&
          /^ds-[a-z0-9-]+$/.test(previous) &&
          !ids.has(previous)
        ) {
          ids.add(previous)
          return
        }
        let id: string
        do {
          id = `ds-${hash(file)}-${index++}`
        } while (ids.has(id) || reserved.has(id))
        ids.add(id)
        path.node.attributes = path.node.attributes.filter(
          (a) =>
            !t.isJSXAttribute(a) ||
            !t.isJSXIdentifier(a.name, { name: "data-digi-id" })
        )
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-digi-id"), t.stringLiteral(id))
        )
        edits.changed = true
      },
    })
    if (edits.changed) doc.files[file] = generate(ast, {}, code).code
  }
  return siteDocumentSchema.parse(doc)
}
export const visualCss = (edits: VisualEdit[]) =>
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
  const element = elementsOf(input).find((e) => e.id === id)
  if (!element || element.text === null)
    throw new Error(
      "Ce contenu est dynamique. Utilisez le chat pour le modifier."
    )
  const doc = structuredClone(input)
  if (element.file.endsWith(".vue")) { doc.files[element.file] = editVueText(doc.files[element.file], element.file, id, text); return siteDocumentSchema.parse(doc) }
  const ast = parseSource(doc.files[element.file])
  traverse(ast, {
    JSXElement(path) {
      if (idOf(path.node.openingElement) === id)
        path.node.children = [
          t.jsxText(
            text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/{/g, "&#123;")
              .replace(/}/g, "&#125;")
          ),
        ]
    },
  })
  doc.files[element.file] = generate(ast).code
  return siteDocumentSchema.parse(doc)
}
export const isEditableFile = (path: string) =>
  /^src\/.+\.(tsx?|jsx?|vue|css|json)$/.test(path) &&
  !path.startsWith("src/components/ui/") &&
  !["src/base.css", "src/visual.css", "src/main.tsx", "src/main.ts"].includes(path)
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
