import { parse, compileScript, compileStyle, compileTemplate } from "@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js"
import { parse as parseTemplate, NodeTypes } from "@vue/compiler-dom"
import type { ElementNode, TemplateChildNode } from "@vue/compiler-dom"
import type { SourceElement } from "./source"

const hash = (text: string) => { let n = 2166136261; for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return (n >>> 0).toString(36) }
export const vueNodes = (code: string, filename: string) => {
  const { descriptor, errors } = parse(code, { filename })
  if (errors.length) throw new Error(`Vue ${filename} : ${String(errors[0])}`)
  const template = descriptor.template
  const nodes: ElementNode[] = []
  const visit = (node: TemplateChildNode) => {
    if (node.type !== NodeTypes.ELEMENT) return
    nodes.push(node)
    node.children.forEach(visit)
  }
  if (template) parseTemplate(template.content).children.forEach(visit)
  return { descriptor, template, nodes }
}
const idOf = (node: ElementNode) => node.props.find(p => p.type === NodeTypes.ATTRIBUTE && p.name === "data-digi-id")
export const vueElements = (code: string, file: string): SourceElement[] => {
  const { template, nodes } = vueNodes(code, file)
  return nodes.flatMap(node => {
    const attribute = idOf(node)
    if (!attribute || attribute.type !== NodeTypes.ATTRIBUTE || !attribute.value) return []
    return [{ id: attribute.value.content, file, tag: node.tag, owner: file.split("/").at(-1)!.replace(/\.vue$/, ""), isOwnerRoot: !nodes.some(parent => parent !== node && parent.loc.start.offset < node.loc.start.offset && parent.loc.end.offset > node.loc.end.offset), kind: node.tagType === 1 ? "component" as const : "html" as const, line: (template?.loc.start.line ?? 1) + node.loc.start.line - 1, signature: hash(node.loc.source), text: node.children.length && node.children.every(c => c.type === NodeTypes.TEXT) ? node.children.map(c => c.type === NodeTypes.TEXT ? c.content : "").join("").trim() : null }]
  })
}
export const normalizeVue = (code: string, file: string, ids: Set<string>, reserved: Set<string>) => {
  const { template, nodes } = vueNodes(code, file)
  if (!template) return code
  const edits: { start: number; end: number; text: string }[] = []
  let index = 0
  for (const node of nodes) {
    if (["template", "slot", "Teleport", "Suspense", "KeepAlive"].includes(node.tag)) continue
    const attr = idOf(node)
    const previous = attr?.type === NodeTypes.ATTRIBUTE ? attr.value?.content : undefined
    if (previous && /^ds-[a-z0-9-]+$/.test(previous) && !ids.has(previous)) { ids.add(previous); continue }
    let id: string
    do { id = `ds-${hash(file)}-${index++}` } while (ids.has(id) || reserved.has(id))
    ids.add(id)
    const offset = template.loc.start.offset
    edits.push(attr ? { start: offset + attr.loc.start.offset, end: offset + attr.loc.end.offset, text: `data-digi-id="${id}"` } : { start: offset + node.loc.start.offset + 1 + node.tag.length, end: offset + node.loc.start.offset + 1 + node.tag.length, text: ` data-digi-id="${id}"` })
  }
  for (const edit of edits.sort((a,b) => b.start-a.start)) code = code.slice(0,edit.start)+edit.text+code.slice(edit.end)
  return code
}
export const editVueText = (code: string, file: string, id: string, text: string) => {
  const { template, nodes } = vueNodes(code, file)
  const node = nodes.find(node => { const attr = idOf(node); return attr?.type === NodeTypes.ATTRIBUTE && attr.value?.content === id })
  if (!template || !node || !node.children.length || !node.children.every(c => c.type === NodeTypes.TEXT)) throw new Error("Contenu dynamique : utilisez le chat.")
  const start = template.loc.start.offset + node.children[0].loc.start.offset
  const end = template.loc.start.offset + node.children.at(-1)!.loc.end.offset
  return code.slice(0,start) + text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/{/g,"&#123;") + code.slice(end)
}
export const compileVue = (source: string, filename: string) => {
  const { descriptor } = vueNodes(source, filename)
  const id = `data-v-${hash(filename)}`
  if (descriptor.template?.src || descriptor.script?.src || descriptor.styles.some(s => s.src || s.lang || s.module)) throw new Error(`Préprocesseur ou bloc externe non pris en charge : ${filename}`)
  let code = "const __component = {};"
  if (descriptor.script || descriptor.scriptSetup) {
    code = compileScript(descriptor, { id, genDefaultAs: "__component", inlineTemplate: !!descriptor.scriptSetup, templateOptions: { compilerOptions: { scopeId: descriptor.styles.some(s => s.scoped) ? id : undefined } } }).content
  }
  if (descriptor.template && !descriptor.scriptSetup) {
    const result = compileTemplate({ source: descriptor.template.content, filename, id, scoped: descriptor.styles.some(s => s.scoped) })
    if (result.errors.length) throw new Error(String(result.errors[0]))
    code += `\n${result.code}\n__component.render = render;`
  }
  for (const style of descriptor.styles) {
    const result = compileStyle({ source: style.content, filename, id, scoped: !!style.scoped })
    if (result.errors.length) throw result.errors[0]
    code += `\n{const style=document.createElement('style');style.textContent=${JSON.stringify(result.code)};document.head.appendChild(style);}`
  }
  if (descriptor.styles.some(s => s.scoped)) code += `\n__component.__scopeId=${JSON.stringify(id)};`
  return code + "\nexport default __component;"
}
