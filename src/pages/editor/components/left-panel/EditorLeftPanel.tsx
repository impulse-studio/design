import { useEditor, useEditorState } from "@/features/editor/context"
import type { SaveStatus } from "@/features/mockups/save-queue"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EditorHeader } from "@/pages/editor/components/header/EditorHeader"
import { ComponentLibrary } from "./ComponentLibrary"
import { LayersPanel } from "./LayersPanel"

export function EditorLeftPanel({
  mockupId,
  notionUrl,
  githubUrl,
  status,
  retry,
  showHeader = true,
}: {
  mockupId: string
  notionUrl: string | null
  githubUrl: string | null
  status: SaveStatus
  retry: () => void
  showHeader?: boolean
}) {
  const editor = useEditor(),
    tab = useEditorState((s) => s.tab)
  return (
    <aside
      className="editor-left-panel flex h-full min-h-0 min-w-0 flex-col bg-background"
      aria-label="Bibliothèque et calques"
    >
      {showHeader && (
        <EditorHeader
          mockupId={mockupId}
          notionUrl={notionUrl}
          githubUrl={githubUrl}
          canEdit={!editor.readOnly}
          status={status}
          retry={retry}
        />
      )}
      <Tabs
        value={tab}
        onValueChange={(value) =>
          editor.set({
            tab: value === "layers" ? "layers" : "components",
          })
        }
        className="min-h-0 flex-1 gap-0"
      >
        <div className="editor-panel-tabs flex h-[42px] min-h-[42px] shrink-0 items-center justify-between gap-1 border-b border-border [padding:0_12px_5px]">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="components" disabled={editor.readOnly}>
              Composants
            </TabsTrigger>
            <TabsTrigger value="layers">Calques</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="components" className="min-h-0 overflow-hidden">
          <ComponentLibrary />
        </TabsContent>
        <TabsContent value="layers" className="min-h-0 overflow-hidden">
          <LayersPanel />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
