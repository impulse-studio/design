import type { FrameNode, Node } from "./doc"

export type AnyNode = FrameNode | Node

/** Where a node sits under its parent: a slot name for components/templates, "children" otherwise. */
export type ChildList = { key: string; nodes: Node[] }

export function childLists(node: AnyNode): ChildList[] {
  switch (node.type) {
    case "frame":
    case "box":
    case "element":
      return [{ key: "children", nodes: node.children }]
    case "component":
    case "template":
      return Object.entries(node.slots ?? {}).map(([key, nodes]) => ({
        key,
        nodes,
      }))
    default:
      return []
  }
}

export function children(node: AnyNode): Node[] {
  return childLists(node).flatMap((list) => list.nodes)
}

export function walk(
  node: AnyNode,
  visit: (node: AnyNode, parent: AnyNode | null, depth: number) => void
): void {
  const go = (n: AnyNode, parent: AnyNode | null, depth: number) => {
    visit(n, parent, depth)
    for (const child of children(n)) go(child, n, depth + 1)
  }
  go(node, null, 0)
}

export type NodeLocation = {
  node: AnyNode
  parent: AnyNode | null
  frame: FrameNode
  path: AnyNode[]
}

export function findNode(frames: FrameNode[], id: string): NodeLocation | null {
  for (const frame of frames) {
    const path: AnyNode[] = []
    const search = (n: AnyNode): boolean => {
      path.push(n)
      if (n.id === id) return true
      for (const child of children(n)) if (search(child)) return true
      path.pop()
      return false
    }
    if (search(frame)) {
      return {
        node: path[path.length - 1],
        parent: path[path.length - 2] ?? null,
        frame,
        path,
      }
    }
  }
  return null
}

/** Props whose value describes a component well enough to name its layer. */
const LABEL_PROPS = ["title", "text", "label"] as const

/** Human label used by layers and inspector: explicit name, else component/template name plus its text. */
export function nodeLabel(node: AnyNode): string {
  if (node.name) return node.name
  switch (node.type) {
    case "component": {
      const caption =
        node.text ??
        node.localVariant?.text ??
        LABEL_PROPS.map((key) => node.props?.[key]).find(
          (v) => typeof v === "string"
        )
      const label = node.localVariant
        ? `${node.component} · ${node.localVariant.name}`
        : node.component
      return caption ? `${label} · ${caption}` : label
    }
    case "template":
      return node.template
    case "box":
      return !node.autoLayout
        ? "Conteneur"
        : node.autoLayout.direction === "grid"
          ? "Auto layout ▦"
          : node.autoLayout.direction === "row"
            ? "Auto layout →"
            : "Auto layout ↓"
    case "text":
      return node.content.slice(0, 40)
    case "image":
      return "Image"
    case "element":
      return `<${node.tag}>`
    default:
      return node.name
  }
}
