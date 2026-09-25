import {
  RiArrowDownLine as ArrowDown,
  RiArrowUpLine as ArrowUp,
  RiFolderTransferLine as FolderInput,
  RiMoreLine as MoreHorizontal,
  RiEditLine as Pencil,
  RiArrowGoBackLine as Undo2,
} from "@remixicon/react"
import { motion, useReducedMotion } from "motion/react"
import { useState, useRef, useEffect } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SPRING_LAYOUT } from "@/lib/motion"
import { useTouchCapable } from "@/hooks/use-touch-capable"
import { cn } from "@/lib/utils"
import { canContain } from "./resources"
import { ResourceIcon } from "./ResourceIcon"
import { ResourceMenuAction } from "./ResourceMenuAction"
import { MarqueeLabel } from "./MarqueeLabel"
import type { ResourceRowProps } from "./types"

export function ResourceRow({
  row,
  active,
  expanded,
  focused,
  draggingId,
  dropTarget,
  menuOpen,
  moves,
  renaming,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onFocus,
  onKeyDown,
  onMenuOpenChange,
  onRenameCancel,
  onRenameCommit,
  onRenameStart,
  onSelect,
  onToggle,
  renderIcon,
  renderMenu,
  setRef,
}: ResourceRowProps) {
  const reduce = useReducedMotion() ?? false
  const canTouch = useTouchCapable()
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const skipRenameBlurRef = useRef(false)
  const draggedRef = useRef(false)
  const [draft, setDraft] = useState(row.item.label)
  const acceptsChildren = canContain(row.item)
  const isDragging = draggingId === row.item.id
  const dropPosition =
    dropTarget?.id === row.item.id ? dropTarget.position : null

  useEffect(() => {
    if (!renaming) return
    skipRenameBlurRef.current = false
    setDraft(row.item.label)
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }, [renaming, row.item.label])

  const runFromMenu = (action: () => void) => () => {
    onMenuOpenChange(false)
    action()
  }

  const menu = renderMenu?.(row.item, {
    close: () => onMenuOpenChange(false),
    rename: () => {
      onMenuOpenChange(false)
      onRenameStart()
    },
    moves,
  }) ?? (
    <>
      <ResourceMenuAction icon={Pencil} onSelect={runFromMenu(onRenameStart)}>
        Renommer
      </ResourceMenuAction>
      {moves.up || moves.down || moves.into || moves.out ? (
        <Separator className="my-1" />
      ) : null}
      {moves.up ? (
        <ResourceMenuAction icon={ArrowUp} onSelect={runFromMenu(moves.up)}>
          Monter
        </ResourceMenuAction>
      ) : null}
      {moves.down ? (
        <ResourceMenuAction icon={ArrowDown} onSelect={runFromMenu(moves.down)}>
          Descendre
        </ResourceMenuAction>
      ) : null}
      {moves.into ? (
        <ResourceMenuAction
          icon={FolderInput}
          onSelect={runFromMenu(moves.into.run)}
        >
          Déplacer dans {moves.into.label}
        </ResourceMenuAction>
      ) : null}
      {moves.out ? (
        <ResourceMenuAction icon={Undo2} onSelect={runFromMenu(moves.out)}>
          Sortir du dossier
        </ResourceMenuAction>
      ) : null}
    </>
  )

  return (
    <motion.div
      ref={setRef}
      layout="position"
      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
      role="treeitem"
      aria-level={row.depth + 1}
      aria-selected={acceptsChildren ? undefined : active}
      aria-expanded={acceptsChildren ? expanded : undefined}
      aria-disabled={row.item.disabled || undefined}
      tabIndex={focused ? 0 : -1}
      draggable={!row.item.disabled && !renaming}
      data-menu-open={menuOpen || undefined}
      data-drop={dropPosition ?? undefined}
      data-dragging={isDragging || undefined}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          draggedRef.current ||
          renaming ||
          row.item.disabled
        )
          return
        if (acceptsChildren) onToggle()
        else onSelect()
      }}
      onDoubleClick={(event) => {
        if (acceptsChildren || row.item.disabled) return
        event.preventDefault()
        onRenameStart()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragStartCapture={(event) => {
        draggedRef.current = true
        onDragStart(event, row.item.id)
      }}
      onDragEndCapture={() => {
        onDragEnd()
        requestAnimationFrame(() => {
          draggedRef.current = false
        })
      }}
      onDragOver={(event) => onDragOver(event, row)}
      onDrop={onDrop}
      className={cn(
        "group/resource relative flex min-h-9 min-w-0 cursor-pointer items-center gap-2.5 rounded-xl pr-3 text-sm outline-none",
        "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "data-[menu-open=true]:bg-muted data-[menu-open=true]:text-foreground",
        "data-[dragging=true]:opacity-40",
        "data-[drop=inside]:bg-muted data-[drop=inside]:ring-1 data-[drop=inside]:ring-primary/45",
        "data-[drop=before]:before:absolute data-[drop=before]:before:-top-0.5 data-[drop=before]:before:right-2 data-[drop=before]:before:left-2 data-[drop=before]:before:h-0.5 data-[drop=before]:before:rounded-full data-[drop=before]:before:bg-primary",
        "data-[drop=after]:after:absolute data-[drop=after]:after:right-2 data-[drop=after]:after:-bottom-0.5 data-[drop=after]:after:left-2 data-[drop=after]:after:h-0.5 data-[drop=after]:after:rounded-full data-[drop=after]:after:bg-primary",
        !acceptsChildren && active && "bg-muted text-foreground",
        row.item.disabled && "cursor-not-allowed opacity-45"
      )}
      style={{ paddingLeft: `${12 + row.depth * 16}px` }}
    >
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center"
      >
        {renderIcon?.(row.item) ?? (
          <ResourceIcon item={row.item} expanded={expanded} />
        )}
      </span>

      {renaming ? (
        <Input
          ref={inputRef}
          value={draft}
          aria-label={`Renommer ${row.item.label}`}
          onChange={(event) => setDraft(event.target.value)}
          draggable={false}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onBlur={() => {
            if (!skipRenameBlurRef.current) onRenameCommit(draft)
          }}
          onKeyDown={(event) => {
            event.stopPropagation()
            if (event.key === "Enter") {
              skipRenameBlurRef.current = true
              onRenameCommit(draft)
            }
            if (event.key === "Escape") {
              skipRenameBlurRef.current = true
              onRenameCancel()
            }
          }}
          className="mx-1 h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <MarqueeLabel active={(!canTouch && hovered) || menuOpen}>
          {row.item.label}
        </MarqueeLabel>
      )}

      {!renaming && !row.item.disabled ? (
        <Popover open={menuOpen} onOpenChange={onMenuOpenChange}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                draggable={false}
                tabIndex={-1}
                aria-label={`Actions pour ${row.item.label}`}
                onClick={(event) => event.stopPropagation()}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg transition-opacity outline-none group-hover/resource:opacity-100 group-data-[menu-open=true]/resource:opacity-100 hover:bg-foreground/5 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
                  // A finger never hovers, and this menu is the only path to
                  // rename and move without a drag — keep it on screen there.
                  canTouch ? "opacity-100" : "opacity-0"
                )}
              />
            }
          >
            <MoreHorizontal aria-hidden="true" className="size-4" />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-40 p-1.5"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              data-sidebar-resource-menu={row.item.id}
            >
              {menu}
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
    </motion.div>
  )
}
