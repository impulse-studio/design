import { useEditor, useEditorState } from "@/features/editor/context"
import type { SaveStatus } from "@/features/mockups/save-queue"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EditorHeader } from "@/pages/editor/components/header/EditorHeader"
import { ComponentLibrary } from "./ComponentLibrary"
import { LayersPanel } from "./LayersPanel"
import { EditorChat } from "@/pages/editor/components/chat/EditorChat"

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
      className="editor-left-panel h-full flex flex-col min-w-0 min-h-0 bg-background"
      aria-label="Bibliothèque, calques et assistant"
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
            tab:
              value === "layers"
                ? "layers"
                : value === "chat"
                  ? "chat"
                  : "components",
          })
        }
        className="min-h-0 flex-1 gap-0"
      >
        <div className="editor-panel-tabs min-h-[42px] h-[42px] shrink-0 flex items-center justify-between gap-1 border-b border-border [padding:0_12px_5px]">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="components" disabled={editor.readOnly}>
              Composants
            </TabsTrigger>
            <TabsTrigger value="layers">Calques</TabsTrigger>
            <TabsTrigger value="chat" disabled={editor.readOnly}>
              Chat IA
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="components" className="min-h-0 overflow-hidden">
          <ComponentLibrary />
        </TabsContent>
        <TabsContent value="layers" className="min-h-0 overflow-hidden">
          <LayersPanel />
        </TabsContent>
        <TabsContent value="chat" className="min-h-0 overflow-hidden">
          <EditorChat mockupId={mockupId} />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
