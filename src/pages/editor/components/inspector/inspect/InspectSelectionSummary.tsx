import { nodeLabel } from "@digit-ai-studio/shared"
import { useSelection } from "@/features/editor/use-selection"
import { bounds, nodeRect } from "@/features/editor/geometry"
import { Button } from "@/components/ui/button"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"

export function InspectSelectionSummary() {
  const { nodes, editor, state } = useSelection()
  const rect = bounds(
    nodes.flatMap((node) => {
      const measured = nodeRect(state, node)
      return measured ? [measured] : []
    })
  )
  return (
    <div className="editor-inspector-scroll flex-1 min-h-0 h-full overflow-auto [scrollbar-width:thin] pb-7 [&_>_.editor-inspector-section:first-of-type]:border-t-0 [&_>_[data-slot=separator]:first-child]:hidden">
      <div className="p-4 text-xs font-medium">
        {nodes.length} calques sélectionnés
      </div>
      <InspectorSection title="Dimensions de la sélection">
        <div className="editor-inspect-metrics flex justify-between text-[12px] text-muted-foreground tabular-nums [&_strong]:ml-2 [&_strong]:text-foreground [&_strong]:font-normal">
          <span>
            W <strong>{rect ? Math.round(rect.width) : "—"}</strong>
          </span>
          <span>
            H <strong>{rect ? Math.round(rect.height) : "—"}</strong>
          </span>
        </div>
      </InspectorSection>
      <InspectorSection title="Calques">
        <p className="text-xs text-muted-foreground">
          Choisissez un calque pour examiner son code et ses styles.
        </p>
        {nodes.map((node) => (
          <Button
            key={node.id}
            variant="ghost"
            size="sm"
            className="justify-start truncate"
            onClick={() => editor.select(node.id)}
          >
            {nodeLabel(node)}
          </Button>
        ))}
      </InspectorSection>
    </div>
  )
}
