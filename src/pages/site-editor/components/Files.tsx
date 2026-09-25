import { useMemo } from "react"
import type { ReactNode } from "react"
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ui/file-tree"
import { projectFileTree } from "@/features/sites/file-tree"
import type { ProjectTreeNode } from "@/features/sites/file-tree"
import type { SiteDocument } from "@/features/sites/schema"

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
    <section className="site-files flex flex-col min-h-0 flex-1" aria-label="Fichiers du projet">
      <div className="site-panel-heading py-[18px] px-4 border-b border-border [&_h2]:text-[13px] [&_h2]:font-semibold [&_p]:text-[11px] [&_p]:text-muted-foreground [&_p]:mt-1">
        <h2>Fichiers du projet</h2>
        <p>Les sources incluses dans votre export ZIP.</p>
      </div>
      <div className="site-file-tree p-2.5 overflow-auto flex-1">
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
