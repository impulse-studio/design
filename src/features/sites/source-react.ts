import { parse } from "@babel/parser"
import traverseModule from "@babel/traverse"
import generateModule from "@babel/generator"
import * as t from "@babel/types"
import { sourceHash } from "./source-model"
import type { ParsedSource, SourceElement } from "./source-model"

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

export const analyzeReact = (code: string, file: string): ParsedSource => {
  const ast = parseSource(code)
  const elements: SourceElement[] = []
  traverse(ast, {
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
        signature: sourceHash(generate(path.node).code),
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

  const normalize: ParsedSource["normalize"] = (claim) => {
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
        const id = claim(previous)
        if (id === previous) return
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
    return edits.changed ? generate(ast, {}, code).code : code
  }
  const editText = (id: string, text: string) => {
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
    return generate(ast).code
  }
  return { elements, normalize, editText }
}
