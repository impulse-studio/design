import type { AnyNode } from "@digit-ai-studio/shared"

import { FieldLabel, PanelSection } from "@/components/studio"

import { importSnippet, layoutCss } from "../../devmode"
import { CodeBlock } from "./CodeBlock"

/** Dev Mode (first cut): component import, props and computed layout. Tokens and Vue snippet come in M5. */
export function InspectTab({ node, size }: { node: AnyNode; size?: { width: number; height: number } }) {
  const snippet = importSnippet(node)
  const props = "props" in node ? Object.entries(node.props ?? {}) : []

  return (
    <>
      {snippet && (
        <PanelSection title="Composant">
          <CodeBlock code={snippet} />
        </PanelSection>
      )}
      {props.length > 0 && (
        <PanelSection title="Props">
          <table className="w-full text-[11px]">
            <tbody>
              {props.map(([name, value]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="py-1 pr-2 text-muted-foreground">{name}</td>
                  <td className="py-1 font-mono break-all">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelSection>
      )}
      <PanelSection title="Layout">
        {layoutCss(node, size).length ? <CodeBlock code={layoutCss(node, size).join("\n")} /> : <FieldLabel>—</FieldLabel>}
      </PanelSection>
    </>
  )
}
