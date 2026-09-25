import type { DragEvent, KeyboardEvent, ReactNode } from "react"

type SidebarResourceKind = "folder" | "project" | "file" | "bookmark"

export interface SidebarResource {
  id: string
  label: string
  kind: SidebarResourceKind
  children?: SidebarResource[]
  disabled?: boolean
}

export type SidebarResourceDropPosition = "before" | "inside" | "after"

export interface SidebarResourceMove {
  itemId: string
  targetId: string | null
  position: SidebarResourceDropPosition
}

/**
 * The moves this row can make right now, the same four the keyboard offers on
 * `Alt+Shift+Arrow`. A pointer drag is the fast path for them; a finger has no
 * drag to give, so the row menu carries them too. Absent keys are moves this
 * row cannot make from where it sits.
 */
export interface SidebarResourceMoveCommands {
  up?: () => void
  down?: () => void
  into?: { label: string; run: () => void }
  out?: () => void
}

interface SidebarResourceMenuControls {
  close: () => void
  rename: () => void
  moves: SidebarResourceMoveCommands
}

export interface AISidebarProps {
  items?: SidebarResource[]
  defaultItems?: SidebarResource[]
  onItemsChange?: (items: SidebarResource[]) => void
  /** Reject the promise to roll the optimistic move back. */
  onMove?: (move: SidebarResourceMove) => void | Promise<void>
  onMoveError?: (error: unknown, move: SidebarResourceMove) => void
  onRename?: (item: SidebarResource, label: string) => void | Promise<void>
  activeId?: string | null
  defaultActiveId?: string | null
  onActiveChange?: (id: string) => void
  defaultExpandedIds?: string[]
  renderIcon?: (item: SidebarResource) => ReactNode
  renderMenu?: (
    item: SidebarResource,
    controls: SidebarResourceMenuControls
  ) => ReactNode
  ariaLabel?: string
  className?: string
}

export interface FlatResource {
  item: SidebarResource
  depth: number
  parentId: string | null
}

export interface DropTarget {
  id: string | null
  position: SidebarResourceDropPosition
}

export interface ResourceRowProps {
  row: FlatResource
  active: boolean
  expanded: boolean
  focused: boolean
  draggingId: string | null
  dropTarget: DropTarget | null
  menuOpen: boolean
  moves: SidebarResourceMoveCommands
  renaming: boolean
  onDragEnd: () => void
  onDragOver: (event: DragEvent<HTMLDivElement>, row: FlatResource) => void
  onDragStart: (event: DragEvent<HTMLDivElement>, id: string) => void
  onDrop: (event: DragEvent<HTMLDivElement>) => void
  onFocus: () => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  onMenuOpenChange: (open: boolean) => void
  onRenameCancel: () => void
  onRenameCommit: (label: string) => void
  onRenameStart: () => void
  onSelect: () => void
  onToggle: () => void
  renderIcon?: (item: SidebarResource) => ReactNode
  renderMenu?: AISidebarProps["renderMenu"]
  setRef: (node: HTMLDivElement | null) => void
}
