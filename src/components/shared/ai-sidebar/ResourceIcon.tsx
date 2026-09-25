import {
  RiFolderOpenLine as FolderOpen,
  RiFolderLine as Folder,
  RiBookmarkLine as Bookmark,
  RiFileTextLine as FileText,
} from "@remixicon/react"
import type { SidebarResource } from "./types"

export function ResourceIcon({
  item,
  expanded,
}: {
  item: SidebarResource
  expanded: boolean
}) {
  const Icon =
    item.kind === "folder" || item.kind === "project"
      ? expanded
        ? FolderOpen
        : Folder
      : item.kind === "bookmark"
        ? Bookmark
        : FileText
  return <Icon className="size-4" />
}
