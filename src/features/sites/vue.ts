import { parse } from "@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js"
import { parse as parseTemplate, NodeTypes } from "@vue/compiler-dom"
import type { ElementNode, TemplateChildNode } from "@vue/compiler-dom"
import { sourceHash } from "./source-model"
import type { ParsedSource, SourceElement } from "./source-model"

const idAttribute = (node: ElementNode) =>
  node.props.find(
    (prop) => prop.type === NodeTypes.ATTRIBUTE && prop.name === "data-digi-id"
  )
const idOf = (node: ElementNode) => {
  const attribute = idAttribute(node)
  return attribute?.type === NodeTypes.ATTRIBUTE
    ? (attribute.value?.content ?? null)
    : null
}
export const analyzeVue = (code: string, file: string): ParsedSource => {
  const { descriptor, errors } = parse(code, { filename: file })
  if (errors.length) throw new Error(`Vue ${file} : ${String(errors[0])}`)
  const template = descriptor.template
  const nodes: ElementNode[] = []
  const visit = (node: TemplateChildNode) => {
    if (node.type !== NodeTypes.ELEMENT) return
    nodes.push(node)
    node.children.forEach(visit)
  }
  if (template) parseTemplate(template.content).children.forEach(visit)
  const elements: SourceElement[] = nodes.flatMap((node) => {
    const id = idOf(node)
    if (!id) return []
    return [
      {
        id,
        file,
        tag: node.tag,
        owner: file
          .split("/")
          .at(-1)!
          .replace(/\.vue$/, ""),
        isOwnerRoot: !nodes.some(
          (parent) =>
            parent !== node &&
            parent.loc.start.offset < node.loc.start.offset &&
            parent.loc.end.offset > node.loc.end.offset
        ),
        kind: node.tagType === 1 ? "component" : "html",
        line: (template?.loc.start.line ?? 1) + node.loc.start.line - 1,
        signature: sourceHash(node.loc.source),
        text:
          node.children.length &&
          node.children.every((child) => child.type === NodeTypes.TEXT)
            ? node.children
                .map((child) => child.content)
                .join("")
                .trim()
            : null,
      },
    ]
  })
  const normalize: ParsedSource["normalize"] = (claim) => {
    if (!template) return code
    const edits: { start: number; end: number; text: string }[] = []
    for (const node of nodes) {
      if (
        ["template", "slot", "Teleport", "Suspense", "KeepAlive"].includes(
          node.tag
        )
      )
        continue
      const previous = idOf(node)
      const id = claim(previous)
      if (id === previous) continue
      const attribute = idAttribute(node)
      const offset = template.loc.start.offset
      const start = offset + node.loc.start.offset + 1 + node.tag.length
      edits.push(
        attribute
          ? {
              start: offset + attribute.loc.start.offset,
              end: offset + attribute.loc.end.offset,
              text: `data-digi-id="${id}"`,
            }
          : { start, end: start, text: ` data-digi-id="${id}"` }
      )
    }
    let normalized = code
    for (const edit of edits.sort((a, b) => b.start - a.start))
      normalized =
        normalized.slice(0, edit.start) + edit.text + normalized.slice(edit.end)
    return normalized
  }
  const editText = (id: string, text: string) => {
    const node = nodes.find((candidate) => idOf(candidate) === id)
    if (
      !template ||
      !node ||
      !node.children.length ||
      !node.children.every((child) => child.type === NodeTypes.TEXT)
    )
      throw new Error(
        "Contenu dynamique : modifiez le fichier source ou utilisez le MCP."
      )
    const start = template.loc.start.offset + node.children[0].loc.start.offset
    const end = template.loc.start.offset + node.children.at(-1)!.loc.end.offset
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/{/g, "&#123;")
      .replace(/}/g, "&#125;")
    return code.slice(0, start) + escaped + code.slice(end)
  }
  return { elements, normalize, editText }
}
