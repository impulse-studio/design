import { RiAddLine, RiDownloadLine } from "@remixicon/react"
import { useEditor } from "@/features/editor/context"
import { Button } from "@/components/ui/button"
import { InspectorSection } from "@/pages/editor/components/inspector/InspectorSection"

export function InspectorExportSection() {
  const editor = useEditor()
  return (
    <InspectorSection
      title="Export"
      defaultOpen={false}
      indicator={<RiAddLine />}
    >
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => {
          const state = editor.state.get()
          const url = URL.createObjectURL(
            new Blob([JSON.stringify(state.doc, null, 2)], {
              type: "application/json",
            })
          )
          const link = document.createElement("a")
          link.href = url
          link.download = `${state.name}.json`
          link.click()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        }}
      >
        <RiDownloadLine data-icon="inline-start" />
        Exporter le document JSON
      </Button>
    </InspectorSection>
  )
}
