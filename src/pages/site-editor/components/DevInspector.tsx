import { useMemo } from "react"
import { ArrowUpRight, Box, FileCode2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sourceElementName } from "@/features/sites/element-name"
import type { PreviewInventoryEntry } from "@/validators/sites/preview"
import type { SiteElementStatus, SourceElement } from "@/features/sites/source"

export function SiteDevInspector({
  elements,
  renderedElements,
  element,
  onSelect,
  onOpenFile,
}: {
  elements: SourceElement[]
  renderedElements: PreviewInventoryEntry[]
  element: SourceElement | null
  domTag: string | null
  count: number
  status: SiteElementStatus | null
  statusById: Map<string, SiteElementStatus>
  onSelect: (id: string) => void
  onOpenFile: (path: string, line: number | null) => void
}) {
  const components = useMemo(() => {
    const byId = new Map(elements.map((item) => [item.id, item]))
    const groups = new Map<string, SourceElement>()
    for (const rendered of renderedElements) {
      const item = byId.get(rendered.id)
      if (!item || rendered.count < 1) continue
      const name = item.kind === "component" ? item.tag : item.owner
      if (!name) continue
      const key = `${item.file}:${name}`
      const existing = groups.get(key)
      if (!existing || (item.line ?? Infinity) < (existing.line ?? Infinity))
        groups.set(key, item)
    }
    return [...groups.entries()]
      .map(([key, item]) => ({
        key,
        item,
        name: item.kind === "component" ? item.tag : (item.owner ?? item.tag),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [elements, renderedElements])

  return (
    <section
      className="@container flex min-w-0 flex-col"
      aria-label="Inspecteur de développement"
    >
      <div
        className="flex min-w-0 flex-col gap-3 border-b border-border p-3"
        aria-live="polite"
      >
        {element ? (
          <>
            <h2 className="text-sm font-semibold tracking-tight break-words">
              {sourceElementName(element)}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto min-h-8 w-full justify-start gap-2 px-0 text-muted-foreground"
              onClick={() => onOpenFile(element.file, element.line)}
              title={element.file}
            >
              <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate text-xs">
                {element.file.split("/").at(-1)}
                {element.line ? `:${element.line}` : ""}
              </span>
              <ArrowUpRight
                className="ml-auto size-3.5 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Sélectionner un composant
          </p>
        )}
      </div>
      {components.length > 0 && (
        <div className="flex flex-col gap-1 p-2">
          <h3 className="px-2 py-2 text-xs font-medium text-muted-foreground">
            Composants
          </h3>
          {components.map(({ key, item, name }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className="w-full min-w-0 justify-start gap-2 px-2 text-xs aria-pressed:bg-accent"
              aria-pressed={Boolean(
                element &&
                element.file === item.file &&
                sourceElementName(element) === name
              )}
              onClick={() => onSelect(item.id)}
            >
              <Box
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{name}</span>
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
