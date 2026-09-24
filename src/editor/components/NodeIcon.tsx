import type { AnyNode } from "@digit-ai-studio/shared"
import {
  RiHashtag,
  RiImageLine,
  RiLayoutColumnLine,
  RiLayoutMasonryLine,
  RiLayoutRowLine,
  type RemixiconComponentType,
  RiText,
  RiVipDiamondLine,
} from "@remixicon/react"
import { cn } from "cn"

function iconFor(node: AnyNode): RemixiconComponentType {
  switch (node.type) {
    case "frame":
      return RiHashtag
    case "component":
      return RiVipDiamondLine
    case "template":
      return RiLayoutMasonryLine
    case "box":
      return node.autoLayout.direction === "row" ? RiLayoutColumnLine : RiLayoutRowLine
    case "text":
      return RiText
    case "image":
      return RiImageLine
  }
}

/** Figma-like layer icon; Digi components and templates are tinted like Figma instances. */
export function NodeIcon({ node, className }: { node: AnyNode; className?: string }) {
  const Icon = iconFor(node)
  const isInstance = node.type === "component" || node.type === "template"
  return <Icon className={cn("size-3.5 shrink-0", isInstance ? "text-violet-600" : "text-muted-foreground", className)} />
}

export function isInstance(node: AnyNode): boolean {
  return node.type === "component" || node.type === "template"
}
