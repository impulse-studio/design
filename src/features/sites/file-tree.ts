export type ProjectTreeNode = { path: string; name: string; children?: ProjectTreeNode[] }
export const projectFileTree = (paths: string[]): ProjectTreeNode[] => {
  const root: ProjectTreeNode[] = []
  for (const path of [...new Set(paths)].sort()) {
    let children = root
    const parts = path.split("/")
    parts.forEach((name, index) => {
      const key = parts.slice(0, index + 1).join("/")
      let node = children.find((item) => item.path === key)
      if (!node) {
        node = { path: key, name, ...(index < parts.length - 1 ? { children: [] } : {}) }
        children.push(node)
      }
      if (node.children) children = node.children
    })
  }
  const sort = (nodes: ProjectTreeNode[]): ProjectTreeNode[] => nodes.sort((a, b) => Number(Boolean(b.children)) - Number(Boolean(a.children)) || a.name.localeCompare(b.name)).map((node) => ({...node, ...(node.children ? {children: sort(node.children)} : {})}))
  return sort(root)
}
