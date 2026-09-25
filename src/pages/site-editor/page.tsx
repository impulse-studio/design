import { SiteEditorInspectorPanel } from "./components/InspectorPanel"
import { SiteEditorSidebar } from "./components/Sidebar"
import { SiteEditorWorkspace } from "./components/Workspace"
import { SiteToolbar } from "./components/Toolbar"
import { useSiteEditorPage } from "./hooks/usePage"
import type { SiteEditorPageProps } from "./hooks/usePage"

export function SiteEditorPage(props: SiteEditorPageProps) {
  const page = useSiteEditorPage(props)

  return (
    <div className="site-editor h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SiteToolbar {...page.toolbar} />
      <div className="flex min-h-0 flex-1 max-[1100px]:overflow-auto">
        <SiteEditorSidebar {...page.sidebar} />
        <SiteEditorWorkspace {...page.workspace} />
        <SiteEditorInspectorPanel {...page.inspector} />
      </div>
    </div>
  )
}
