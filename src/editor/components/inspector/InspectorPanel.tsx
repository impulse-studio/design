import { findNode, nodeLabel } from "@digit-ai-studio/shared"
import { shallow } from "@tanstack/react-store"
import { useMemo, useState } from "react"

import { EmptyState, PanelBody, PanelHeader, SegmentedControl } from "@/components/studio"

import { NODE_TYPE_LABELS } from "../../constants"
import { useEditor } from "../../context"
import { nodeCanvasRect } from "../../geometry"
import { NodeIcon } from "../NodeIcon"
import { AutoLayoutSection } from "./AutoLayoutSection"
import { FrameSection } from "./FrameSection"
import { InspectTab } from "./InspectTab"
import { PropsSection } from "./PropsSection"
import { SizeSection } from "./SizeSection"
import { TextSection } from "./TextSection"

type Tab = "design" | "inspect"
const TABS = [
  { value: "design" as const, label: "Design" },
  { value: "inspect" as const, label: "Inspect" },
]

export function InspectorPanel() {
  const [tab, setTab] = useState<Tab>("design")
  const selectedId = useEditor((s) => (s.selectedIds.length === 1 ? s.selectedIds[0]! : null))
  const frames = useEditor((s) => s.doc.frames)
  const location = useMemo(() => (selectedId ? findNode(frames, selectedId) : null), [frames, selectedId])
  const size = useEditor((s) => {
    if (!location) return undefined
    const rect = nodeCanvasRect(s, location.frame, location.node.id)
    return rect ? { width: rect.width, height: rect.height } : undefined
  }, shallow)
  const zoom = useEditor((s) => Math.round(s.viewport.zoom * 100))

  const node = location?.node

  return (
    <>
      <PanelHeader className="justify-between">
        <div className="w-40">
          <SegmentedControl value={tab} options={TABS} onChange={setTab} />
        </div>
        <span className="text-muted-foreground tabular-nums">{zoom}%</span>
      </PanelHeader>
      <PanelBody>
        {!node ? (
          <EmptyState>Sélectionne un calque pour voir ses propriétés.</EmptyState>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b px-3 py-3">
              <NodeIcon node={node} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{nodeLabel(node)}</p>
                <p className="text-[11px] text-muted-foreground">{NODE_TYPE_LABELS[node.type]}</p>
              </div>
            </div>
            {tab === "inspect" ? (
              <InspectTab node={node} size={size} />
            ) : node.type === "frame" ? (
              <FrameSection frame={node} />
            ) : (
              <>
                {node.type === "box" && <AutoLayoutSection node={node} />}
                <SizeSection node={node} measured={size} />
                {(node.type === "component" || node.type === "template") && <PropsSection node={node} />}
                {node.type === "text" && <TextSection node={node} />}
              </>
            )}
          </>
        )}
      </PanelBody>
    </>
  )
}
