import { useState } from "react"
import type { AnyNode } from "@digit-ai-studio/shared"
import { childLists, nodeLabel, findNode } from "@digit-ai-studio/shared"
import {
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiArtboard2Line,
  RiText,
  RiLayoutLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiLockUnlockLine,
  RiMoreLine,
  RiApps2Line,
} from "@remixicon/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { entryFor } from "@/features/editor/library"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { copySelection, pasteSelection } from "@/features/editor/clipboard"

export function LayerRow({
  node,
  depth = 0,
}: {
  node: AnyNode
  depth?: number
}) {
  const editor = useEditor(),
    inspect = useEditorState((s) => s.rightTab === "inspect"),
    selected = useEditorState((s) => s.selectedIds.includes(node.id)),
    hovered = useEditorState((s) => s.hoveredId === node.id)
  const [expanded, setExpanded] = useState(true),
    [renaming, setRenaming] = useState(false),
    [name, setName] = useState(nodeLabel(node)),
    [drop, setDrop] = useState<"before" | "inside" | "after" | null>(null)
  const declaredSlots =
    node.type === "component" || node.type === "template"
      ? (entryFor(node.type === "component" ? node.component : node.template)
          ?.slots ?? [])
      : []
  const existingLists = childLists(node)
  const lists = [
      ...existingLists,
      ...declaredSlots
        .filter((key) => !existingLists.some((list) => list.key === key))
        .map((key) => ({ key, nodes: [] })),
    ],
    Icon =
      node.type === "frame"
        ? RiArtboard2Line
        : node.type === "text"
          ? RiText
          : node.type === "box"
            ? RiLayoutLine
            : RiApps2Line
  const action = (run: () => void) => {
    if (!selected) editor.select(node.id)
    run()
  }
  const finishRename = () => {
    if (name.trim())
      editor.updateNodes(
        [node.id],
        (value) => {
          value.name = name.trim()
        },
        true
      )
    setRenaming(false)
  }
  return (
    <div
      role="treeitem"
      aria-selected={selected}
      aria-expanded={lists.length ? expanded : undefined}
      aria-label={nodeLabel(node)}
    >
      <div
        className="editor-layer-row relative flex h-[34px] items-center gap-0.75 pr-1.75 select-none [&:focus-within_.editor-layer-actions]:max-w-[none] [&[data-drop=after]]:shadow-[inset_0_-2px_var(--editor-selection)] [&[data-drop=before]]:shadow-[inset_0_2px_var(--editor-selection)] [&[data-drop=inside]]:[outline:1px_solid_var(--editor-selection)] [&[data-drop=inside]]:[outline-offset:-1px] [&[data-hidden]_>_.editor-layer-name]:opacity-[0.45] [&[data-hovered]:not([data-selected])]:bg-muted [&[data-selected]]:[background:color-mix(in_srgb,_var(--editor-selection),_transparent_89%)] [&[data-selected]_.editor-layer-actions]:max-w-[none]"
        data-selected={selected || undefined}
        data-hovered={hovered || undefined}
        data-hidden={node.hidden || undefined}
        data-drop={drop ?? undefined}
        style={{ paddingLeft: 8 + depth * 14 }}
        draggable={!inspect && !renaming && !node.locked}
        onDragStart={(event) => {
          event.dataTransfer.setData(
            "application/x-digit-layers",
            JSON.stringify(
              selected ? editor.state.get().selectedIds : [node.id]
            )
          )
          event.stopPropagation()
        }}
        onDragOver={(event) => {
          if (inspect) return
          if (
            !event.dataTransfer.types.includes("application/x-digit-layers") &&
            !event.dataTransfer.types.includes("application/x-digit-component")
          )
            return
          event.preventDefault()
          event.stopPropagation()
          const rect = event.currentTarget.getBoundingClientRect(),
            fraction = (event.clientY - rect.top) / rect.height
          setDrop(
            fraction < 0.25 ? "before" : fraction > 0.75 ? "after" : "inside"
          )
        }}
        onDragLeave={() => setDrop(null)}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (inspect) return
          const position = drop
          setDrop(null)
          const location = findNode(framesOf(editor.state.get().doc), node.id)!
          const parent = position === "inside" ? node : location.parent
          if (!parent) return
          const list = childLists(parent).find((l) =>
            l.nodes.some((n) => n.id === node.id)
          )
          const index = list
            ? list.nodes.findIndex((n) => n.id === node.id) +
              (position === "after" ? 1 : 0)
            : Infinity
          const component = event.dataTransfer.getData(
            "application/x-digit-component"
          )
          if (component) editor.insert(component, parent.id)
          else {
            try {
              const ids: unknown = JSON.parse(
                event.dataTransfer.getData("application/x-digit-layers")
              )
              if (
                Array.isArray(ids) &&
                ids.every((id) => typeof id === "string")
              )
                editor.moveNodes(
                  ids,
                  parent.id,
                  position === "inside" ? undefined : list?.key,
                  position === "inside" ? Infinity : index
                )
            } catch {
              /* Ignore unrelated drag payloads. */
            }
          }
        }}
        onMouseEnter={() => editor.set({ hoveredId: node.id })}
        onMouseLeave={() => editor.set({ hoveredId: null })}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={
            expanded
              ? `Replier ${nodeLabel(node)}`
              : `Déplier ${nodeLabel(node)}`
          }
          className={lists.length ? "" : "invisible"}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
        </Button>
        <Icon className="editor-layer-icon h-[14px] w-[14px] shrink-0 text-muted-foreground" />
        {renaming ? (
          <Input
            autoFocus
            controlSize="sm"
            aria-label="Nom du calque"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={finishRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") finishRename()
              if (event.key === "Escape") setRenaming(false)
            }}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="editor-layer-name min-w-0 flex-1 justify-start overflow-hidden px-1 text-[11px] text-ellipsis whitespace-nowrap"
            onClick={(event) => editor.select(node.id, event.shiftKey)}
            onDoubleClick={() => {
              if (inspect) return
              setName(nodeLabel(node))
              setRenaming(true)
            }}
            onKeyDown={(event) => {
              if (["ArrowRight", "ArrowLeft", "F2"].includes(event.key))
                event.stopPropagation()
              if (event.key === "ArrowRight") setExpanded(true)
              if (event.key === "ArrowLeft") setExpanded(false)
              if (event.key === "F2" && !inspect) {
                setName(nodeLabel(node))
                setRenaming(true)
              }
            }}
          >
            {nodeLabel(node)}
          </Button>
        )}
        <div className="editor-layer-actions flex max-w-0 items-center overflow-hidden">
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={inspect}
            aria-label={
              node.hidden ? "Afficher le calque" : "Masquer le calque"
            }
            onClick={() =>
              editor.updateNodes(
                [node.id],
                (value) => {
                  value.hidden = !value.hidden
                },
                true
              )
            }
          >
            {node.hidden ? <RiEyeOffLine /> : <RiEyeLine />}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={inspect}
            aria-label={
              node.locked ? "Déverrouiller le calque" : "Verrouiller le calque"
            }
            onClick={() =>
              editor.updateNodes(
                [node.id],
                (value) => {
                  value.locked = !value.locked
                },
                true
              )
            }
          >
            {node.locked ? <RiLockLine /> : <RiLockUnlockLine />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Actions du calque"
                />
              }
            >
              <RiMoreLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => {
                    setName(nodeLabel(node))
                    setRenaming(true)
                  }}
                >
                  Renommer
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => action(editor.duplicate)}
                >
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => action(() => void copySelection(editor))}
                >
                  Copier
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => action(() => void pasteSelection(editor))}
                >
                  Coller
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => action(editor.group)}
                >
                  Ajouter un auto-layout
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => action(editor.ungroup)}
                >
                  Dissocier
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={inspect}
                  onClick={() => action(editor.remove)}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {expanded && lists.length > 0 && (
        <div role="group">
          {lists.map((list) => (
            <div key={list.key}>
              {list.key !== "children" && (
                <div
                  className="editor-slot-row flex h-[27px] items-center gap-1.5 text-[10px] text-muted-foreground [&_span]:tabular-nums [&_span]:opacity-[0.6]"
                  style={{ paddingLeft: 30 + depth * 14 }}
                  onDragOver={(event) => {
                    if (!inspect) event.preventDefault()
                  }}
                  onDrop={(event) => {
                    if (inspect) return
                    event.preventDefault()
                    event.stopPropagation()
                    const component = event.dataTransfer.getData(
                      "application/x-digit-component"
                    )
                    if (component) editor.insert(component, node.id, list.key)
                    else {
                      try {
                        const ids: unknown = JSON.parse(
                          event.dataTransfer.getData(
                            "application/x-digit-layers"
                          )
                        )
                        if (
                          Array.isArray(ids) &&
                          ids.every((id) => typeof id === "string")
                        )
                          editor.moveNodes(ids, node.id, list.key)
                      } catch {
                        /* Invalid drag data. */
                      }
                    }
                  }}
                >
                  ↳ {list.key}
                  <span>{list.nodes.length}</span>
                </div>
              )}
              {list.nodes.map((child) => (
                <LayerRow key={child.id} node={child} depth={depth + 1} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
