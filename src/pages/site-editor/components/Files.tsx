import { useMemo } from "react"
import type { ReactNode } from "react"
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ui/file-tree"
import { projectFileTree } from "@/features/sites/file-tree"
import type { ProjectTreeNode } from "@/features/sites/file-tree"
import type { SiteDocument } from "@/validators/sites/document"

export function SiteFiles({
  doc,
  selected,
  onSelect,
}: {
  doc: SiteDocument
  selected: string | null
  onSelect: (path: string) => void
}) {
  const nodes = useMemo(
    () =>
      projectFileTree([...Object.keys(doc.files), ...Object.keys(doc.assets)]),
    [doc.files, doc.assets]
  )
  const renderNode = (node: ProjectTreeNode): ReactNode =>
    node.children ? (
      <FileTreeFolder key={node.path} value={node.path} name={node.name}>
        {node.children.map(renderNode)}
      </FileTreeFolder>
    ) : (
      <FileTreeFile key={node.path} value={node.path} name={node.name} />
    )
  return (
    <section
      className="site-files flex min-h-0 flex-1 flex-col"
      aria-label="Fichiers du projet"
    >
      <div className="site-file-tree flex-1 overflow-auto px-2 py-4">
        <FileTree
          value={selected}
          onValueChange={(path) => {
            if (
              Object.hasOwn(doc.files, path) ||
              Object.hasOwn(doc.assets, path)
            )
              onSelect(path)
          }}
          defaultExpandedIds={["src", "src/pages", "src/routes"]}
          ariaLabel="Fichiers du projet"
        >
          {nodes.map(renderNode)}
        </FileTree>
      </div>
    </section>
  )
}
