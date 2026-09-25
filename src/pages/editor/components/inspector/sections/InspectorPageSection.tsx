import { useEditor, useEditorState } from "@/features/editor/context"
import { library } from "@/features/editor/library"
import { InspectorColorField } from "@/pages/editor/components/inspector/InspectorColorField"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"
import { InspectorExportSection } from "./InspectorExportSection"

export function InspectorPageSection() {
  const editor = useEditor()
  const background = useEditorState((state) => state.doc.pages[0].background)
  return (
    <>
      <InspectorSection title="Page">
        <InspectorColorField
          label="Fond du canvas"
          hideLabel
          alpha={false}
          value={background}
          onChange={(value) => {
            if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value))
              editor.change((doc) => {
                doc.pages[0].background = value
              })
          }}
        />
      </InspectorSection>
      <InspectorSection title="Styles" defaultOpen={false}>
        <div className="editor-inspect-property flex items-baseline justify-between gap-4 text-[11px] [&_>_span:first-child]:text-muted-foreground [&_code]:wrap-anywhere [&_code]:text-right [&_code]:max-w-[65%]">
          <span>Bibliothèque</span>
          <span>Digitevent</span>
        </div>
        <div className="editor-style-list flex flex-col gap-3">
          {Object.entries(library.tokens.color)
            .slice(0, 8)
            .map(([name]) => (
              <div key={name} className="editor-inspect-property flex items-baseline justify-between gap-4 text-[11px] [&_>_span:first-child]:text-muted-foreground [&_code]:wrap-anywhere [&_code]:text-right [&_code]:max-w-[65%]">
                <span>{name}</span>
                <span className="editor-style-token [color:var(--editor-component)]">Variable</span>
              </div>
            ))}
        </div>
      </InspectorSection>
      <InspectorExportSection />
    </>
  )
}
