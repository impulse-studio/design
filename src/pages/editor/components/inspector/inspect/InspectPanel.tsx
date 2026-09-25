import { useEffect, useState } from "react"
import { RiFileCopyLine, RiCheckLine } from "@remixicon/react"
import { findNode, nodeLabel } from "@digit-ai-studio/shared"
import { useSelection } from "@/features/editor/use-selection"
import { framesOf } from "@/features/editor/document"
import { nodeRect } from "@/features/editor/geometry"
import {
  hasCustomStyles,
  usedTokens,
  reactSnippet,
  reactImports,
} from "@/features/editor/inspect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"

export function InspectPanel() {
  const { nodes, state, editor } = useSelection(),
    [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])
  const node = nodes.at(0)
  if (!node)
    return (
      <div className="editor-inspect-empty py-6 px-[18px] text-muted-foreground text-[12px] leading-[1.8]">
        Sélectionnez un calque pour examiner son code et ses styles.
      </div>
    )
  const location = findNode(framesOf(state.doc), node.id)!,
    rect = nodeRect(state, node),
    styles = state.layouts[location.frame.id]?.computed?.[node.id] ?? {}
  const snippet = `${reactImports(node)}\n\n${reactSnippet(node)}`.trim()
  return (
    <div className="editor-inspector-scroll flex-1 min-h-0 h-full overflow-auto [scrollbar-width:thin] pb-7 [&_>_.editor-inspector-section:first-of-type]:border-t-0 [&_>_[data-slot=separator]:first-child]:hidden">
      <div className="p-4">
        <div className="truncate text-sm font-medium">{nodeLabel(node)}</div>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="secondary">
            {node.type === "component"
              ? "Composant Digi · React"
              : node.type === "template"
                ? "Template back"
                : node.type}
          </Badge>
          {hasCustomStyles(node) && (
            <Badge variant="outline">Valeurs libres</Badge>
          )}
        </div>
      </div>
      <InspectorSection title="Dimensions">
        <div className="editor-inspect-metrics flex justify-between text-[12px] text-muted-foreground tabular-nums [&_strong]:ml-2 [&_strong]:text-foreground [&_strong]:font-normal">
          <span>
            W <strong>{Math.round(rect?.width ?? 0)}</strong>
          </span>
          <span>
            H <strong>{Math.round(rect?.height ?? 0)}</strong>
          </span>
        </div>
        <div className="editor-box-model p-2 border border-dashed border-border-strong bg-muted flex flex-col items-center gap-1.25 text-[10px] text-muted-foreground [&_>_div]:flex [&_>_div]:items-center [&_>_div]:justify-between [&_>_div]:w-full [&_>_div]:gap-2 [&_strong]:bg-background [&_strong]:border [&_strong]:border-border [&_strong]:py-3 [&_strong]:px-1.25 [&_strong]:flex-1 [&_strong]:text-center [&_strong]:text-foreground [&_strong]:font-normal">
          <span>padding</span>
          <span>{styles["padding-top"] ?? "0px"}</span>
          <div>
            <span>{styles["padding-left"] ?? "0px"}</span>
            <strong>
              {Math.round(rect?.width ?? 0)} × {Math.round(rect?.height ?? 0)}
            </strong>
            <span>{styles["padding-right"] ?? "0px"}</span>
          </div>
          <span>{styles["padding-bottom"] ?? "0px"}</span>
        </div>
      </InspectorSection>
      <InspectorSection title="Propriétés">
        {node.type === "component" || node.type === "template" ? (
          Object.entries(node.props ?? {}).map(([key, value]) => (
            <div key={key} className="editor-inspect-property flex items-baseline justify-between gap-4 text-[11px] [&_>_span:first-child]:text-muted-foreground [&_code]:wrap-anywhere [&_code]:text-right [&_code]:max-w-[65%]">
              <span>{key}</span>
              <code>{JSON.stringify(value)}</code>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            Aucune propriété de composant.
          </p>
        )}
      </InspectorSection>
      <InspectorSection title="Styles calculés">
        <pre className="editor-code [margin:0] p-2.5 max-h-[360px] overflow-auto rounded-[5px] bg-muted [font:10px/1.8_ui-monospace,_monospace]">
          {Object.entries(styles)
            .map(([key, value]) => `${key}: ${value};`)
            .join("\n") || "Sélectionnez un élément de la frame."}
        </pre>
      </InspectorSection>
      <InspectorSection title="Tokens utilisés">
        <div className="flex flex-wrap gap-1">
          {usedTokens(node).map((token) => (
            <Badge key={token} variant="outline">
              {token}
            </Badge>
          ))}
        </div>
      </InspectorSection>
      <InspectorSection title="React">
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(snippet)
              setCopied(true)
            } catch {
              setCopied(false)
              editor.set({
                notice:
                  "Le code n’a pas pu être copié. Sélectionnez-le pour le copier manuellement.",
              })
            }
          }}
        >
          {copied ? (
            <RiCheckLine data-icon="inline-start" />
          ) : (
            <RiFileCopyLine data-icon="inline-start" />
          )}
          {copied ? "Copié" : "Copier le code"}
        </Button>
        <pre className="editor-code [margin:0] p-2.5 max-h-[360px] overflow-auto rounded-[5px] bg-muted [font:10px/1.8_ui-monospace,_monospace]">{snippet}</pre>
      </InspectorSection>
    </div>
  )
}
