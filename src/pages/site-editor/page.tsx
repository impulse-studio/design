import { SiteEditorInspectorPanel } from "./components/InspectorPanel"
import { SiteEditorSidebar } from "./components/Sidebar"
import { SiteEditorWorkspace } from "./components/Workspace"
import { SiteToolbar } from "./components/Toolbar"
import { useSiteEditorPage } from "./hooks/usePage"
import type { SiteEditorPageProps } from "./hooks/usePage"

export function SiteEditorPage(props: SiteEditorPageProps) {
  const page = useSiteEditorPage(props)

  return (
    <div className="site-editor flex h-[100dvh] flex-col overflow-hidden bg-background motion-reduce:**:animate-none! motion-reduce:**:transition-none!">
      <SiteToolbar {...page.toolbar} />
      <div className="flex min-h-0 flex-1 overflow-auto">
        <div
          id="site-sidebar"
          hidden={!page.sidebarVisible}
          className="flex shrink-0 [&[hidden]]:hidden"
        >
          <SiteEditorSidebar {...page.sidebar} />
        </div>
        <SiteEditorWorkspace {...page.workspace} />
        {page.inspector.mode !== "navigation" && (
          <SiteEditorInspectorPanel {...page.inspector} />
        )}
      </div>
    </div>
  )
}
