import { type AnyNode, childLists, nodeLabel } from "@digit-ai-studio/shared"
import { RiArrowDownSLine, RiArrowRightSLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { cn } from "cn"
import { useState } from "react"

import { EmptyState, PanelSection } from "@/components/studio"

import { SELECTION_COLOR } from "../constants"
import { useEditor, useEditorActions } from "../context"
import { isInstance, NodeIcon } from "./NodeIcon"

const INDENT = 12

function LayerRow({ node, depth, slotLabel }: { node: AnyNode; depth: number; slotLabel?: string }) {
  const { select, hover, updateNode } = useEditorActions()
  const selected = useEditor((s) => s.selectedIds.includes(node.id))
  const hovered = useEditor((s) => s.hoveredId === node.id)
  const [open, setOpen] = useState(depth < 2)
  const lists = childLists(node).filter((l) => l.nodes.length > 0)
  const hidden = "hidden" in node && node.hidden
  const showSlotNames = lists.length > 1 || (lists[0] && lists[0].key !== "children" && lists[0].key !== "default")

  return (
    <li>
      <div
        role="treeitem"
        aria-selected={selected}
        aria-expanded={lists.length ? open : undefined}
        className={cn(
          "group flex h-7 cursor-default items-center gap-1.5 pr-2 text-xs",
          selected ? "bg-[#E5F4FF]" : hovered && "outline outline-1 -outline-offset-1",
          hidden && "opacity-50",
          depth === 0 && "font-medium",
        )}
        style={{ paddingLeft: 4 + depth * INDENT, outlineColor: SELECTION_COLOR }}
        onClick={(e) => select(node.id, e.shiftKey)}
        onMouseEnter={() => hover(node.id)}
        onMouseLeave={() => hover(null)}
      >
        <button
          type="button"
          aria-label={open ? "Replier" : "Déplier"}
          className={cn("flex size-4 items-center justify-center text-muted-foreground", !lists.length && "invisible")}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {open ? <RiArrowDownSLine className="size-3.5" /> : <RiArrowRightSLine className="size-3.5" />}
        </button>
        <NodeIcon node={node} />
        <span className={cn("min-w-0 flex-1 truncate", isInstance(node) && "text-violet-700")}>
          {slotLabel && <span className="text-muted-foreground">{slotLabel} · </span>}
          {nodeLabel(node)}
        </span>
        {node.type !== "frame" && (
          <button
            type="button"
            aria-label={hidden ? "Afficher" : "Masquer"}
            className={cn("text-muted-foreground", !hidden && "invisible group-hover:visible")}
            onClick={(e) => {
              e.stopPropagation()
              updateNode(node.id, (n) => {
                if (n.type !== "frame") n.hidden = !hidden
              })
            }}
          >
            {hidden ? <RiEyeOffLine className="size-3.5" /> : <RiEyeLine className="size-3.5" />}
          </button>
        )}
      </div>
      {open && lists.length > 0 && (
        <ul role="group">
          {lists.flatMap((list) =>
            list.nodes.map((child) => (
              <LayerRow key={child.id} node={child} depth={depth + 1} slotLabel={showSlotNames ? list.key : undefined} />
            )),
          )}
        </ul>
      )}
    </li>
  )
}

export function LayersPanel() {
  const frames = useEditor((s) => s.doc.frames)
  return (
    <PanelSection title="Layers" flush className="border-b-0">
      {frames.length === 0 ? (
        <EmptyState>Aucune frame. Demande à l'IA de créer une page.</EmptyState>
      ) : (
        <ul role="tree" aria-label="Layers">
          {frames.map((frame) => (
            <LayerRow key={frame.id} node={frame} depth={0} />
          ))}
        </ul>
      )}
    </PanelSection>
  )
}
