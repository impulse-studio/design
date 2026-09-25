import { SiteEditorPage } from "@/pages/site-editor/page"
import { useLoaderData } from "@tanstack/react-router"
import { EditorWorkspace } from "./components/shell/EditorWorkspace"
import { APP_ROUTES } from "@/constants"

export function EditorPage() {
  const initial = useLoaderData({ from: APP_ROUTES.editor })
  if (initial.site)
    return (
      <SiteEditorPage
        key={initial.id}
        initial={initial.site}
        mockupId={initial.id}
        name={initial.name}
        notionUrl={initial.notionUrl}
        githubUrl={initial.githubUrl}
        canEdit={initial.canEdit}
      />
    )
  return (
    <EditorWorkspace
      key={`${initial.id}:${initial.canEdit}:${initial.canEdit ? "local" : initial.revision}`}
      initial={initial}
      readOnly={!initial.canEdit}
    />
  )
}
