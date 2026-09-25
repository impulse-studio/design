import { useMemo, useState } from "react"
import {
  RiSearchLine,
  RiLayout2Line,
  RiAddLine,
  RiText,
  RiSquareLine,
  RiApps2Line,
} from "@remixicon/react"
import { libraryEntries, insertionIssue, localVariantsOf } from "@/features/editor/library"
import { useEditor, useEditorState } from "@/features/editor/context"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export function ComponentLibrary() {
  const editor = useEditor(),
    inspect = useEditorState((s) => s.rightTab === "inspect"),
    doc = useEditorState((s) => s.doc),
    [query, setQuery] = useState("")
  const localVariants = useMemo(
    () =>
      localVariantsOf(doc).filter(({ component, variant }) =>
        `${variant.name} ${component}`.toLowerCase().includes(query.toLowerCase())
      ),
    [doc, query]
  )
  const groups = useMemo(() => {
    const map = new Map<string, typeof libraryEntries>()
    for (const entry of libraryEntries) {
      if (
        !`${entry.name} ${entry.category ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        continue
      const category =
        entry.name === "EventLayout"
          ? "Templates"
          : (entry.category ?? "Composants")
      map.set(category, [...(map.get(category) ?? []), entry])
    }
    return [...map.entries()].sort(([a], [b]) =>
      a === "Templates" ? -1 : b === "Templates" ? 1 : a.localeCompare(b)
    )
  }, [query])
  return (
    <div className="editor-library h-full min-h-0 flex flex-col">
      <div className="p-3">
        <InputGroup>
          <InputGroupAddon>
            <RiSearchLine />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Rechercher un composant"
            placeholder="Rechercher un composant…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="editor-library-scroll flex-1 min-h-0 overflow-auto [padding:0_8px_20px] [scrollbar-width:thin]">
        <div className="editor-library-heading h-[36px] flex justify-between items-center [padding:0_8px] text-[11px] font-medium capitalize [&_>_span_+_span]:text-muted-foreground [&_>_span_+_span]:text-[10px] [&_>_span_+_span]:tabular-nums">
          <span>Fondations</span>
          <span>2</span>
        </div>
        <div className="editor-foundations grid grid-cols-2 gap-1.5 [margin:0_4px_14px]">
          <Button
            disabled={inspect}
            variant="outline"
            onClick={() => editor.insert("box")}
          >
            <RiSquareLine data-icon="inline-start" />
            Conteneur
          </Button>
          <Button
            disabled={inspect}
            variant="outline"
            onClick={() => editor.insert("text")}
          >
            <RiText data-icon="inline-start" />
            Texte
          </Button>
        </div>
        {localVariants.length > 0 && (
          <>
            <div className="editor-library-heading h-[36px] flex justify-between items-center [padding:0_8px] text-[11px] font-medium capitalize [&_>_span_+_span]:text-muted-foreground [&_>_span_+_span]:text-[10px] [&_>_span_+_span]:tabular-nums">
              <span>Variantes de cette maquette</span>
              <span>{localVariants.length}</span>
            </div>
            {localVariants.map(({ component, variant }) => (
              <Button
                key={variant.id}
                variant="ghost"
                className="editor-library-item w-full h-[42px] flex gap-2.5 py-1.25 px-2 text-[13px] cursor-grab [&:active]:cursor-grabbing [&[aria-disabled=true]]:opacity-[0.45] [&[aria-disabled=true]]:cursor-default [&_>_svg]:opacity-[0]"
                disabled={inspect}
                onClick={() => editor.insertLocalVariant(variant.id)}
              >
                <span className="editor-component-glyph grid place-items-center w-[28px] h-[28px] rounded-[5px] bg-muted [color:var(--editor-component)] shrink-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"><RiApps2Line /></span>
                <span className="min-w-0 flex-1 truncate text-left">
                  {variant.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {component.replace(/^Digi/, "")}
                </span>
                <RiAddLine />
              </Button>
            ))}
          </>
        )}
        {groups.map(([category, entries]) => (
          <Collapsible key={category} defaultOpen>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="editor-library-heading h-[36px] flex justify-between items-center [padding:0_8px] text-[11px] font-medium capitalize [&_>_span_+_span]:text-muted-foreground [&_>_span_+_span]:text-[10px] [&_>_span_+_span]:tabular-nums w-full justify-between"
                />
              }
            >
              <span>{category.replace(/-/g, " ")}</span>
              <span className="text-muted-foreground">{entries.length}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {entries.map((entry) => {
                const issue = insertionIssue(entry)
                return (
                  <Tooltip key={entry.name}>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          className="editor-library-item w-full h-[42px] flex gap-2.5 py-1.25 px-2 text-[13px] cursor-grab [&:active]:cursor-grabbing [&[aria-disabled=true]]:opacity-[0.45] [&[aria-disabled=true]]:cursor-default [&_>_svg]:opacity-[0]"
                          draggable={!issue && !inspect}
                          disabled={inspect}
                          aria-disabled={!!issue}
                          onDragStart={(event) =>
                            event.dataTransfer.setData(
                              "application/x-digit-component",
                              entry.name
                            )
                          }
                          onClick={() =>
                            issue
                              ? editor.set({
                                  notice: `${entry.name} : ${issue}`,
                                })
                              : editor.insert(entry.name)
                          }
                        />
                      }
                    >
                      <span className="editor-component-glyph grid place-items-center w-[28px] h-[28px] rounded-[5px] bg-muted [color:var(--editor-component)] shrink-0 [&_svg]:w-[15px] [&_svg]:h-[15px]">
                        {entry.name === "EventLayout" ? (
                          <RiLayout2Line />
                        ) : (
                          <RiApps2Line />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-left">
                        {entry.name.replace(/^Digi/, "")}
                      </span>
                      {issue ? (
                        <span className="text-xs text-muted-foreground">◦</span>
                      ) : (
                        <RiAddLine />
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {entry.name}
                      {issue
                        ? ` · ${issue}`
                        : " · Cliquer ou glisser pour insérer"}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
        {groups.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Aucun composant</EmptyTitle>
              <EmptyDescription>Essayez un autre nom.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
      <div className="editor-library-footer flex items-center gap-1.75 py-[11px] px-4 border-t border-border text-muted-foreground text-[10px]">
        <Badge variant="outline">Digi</Badge>
        <span>{libraryEntries.length - 1} composants · React</span>
      </div>
    </div>
  )
}
