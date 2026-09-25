import { createFileRoute } from "@tanstack/react-router"
import { PROJECT_NAME } from "@/constants"
import { EditorPage } from "@/pages/editor/page"
import { EditorLoadError } from "@/pages/editor/components/shell/EditorLoadError"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"
import { reloadSiteEditorForIsolation } from "@/features/sites/isolation-navigation"

export const Route = createFileRoute("/m/$mockupId")({
  beforeLoad: ({ context, location }) => {
    requireAuthenticatedUser(context.user, location.pathname)
    if (reloadSiteEditorForIsolation()) return new Promise<never>(() => {})
  },
  loader: ({ context, params }) =>
    context.queryClient.fetchQuery(
      context.orpc.mockups.get.queryOptions({
        input: { id: params.mockupId },
      })
    ),
  component: EditorPage,
  errorComponent: EditorLoadError,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name ?? "Éditeur"} — ${PROJECT_NAME}` }],
  }),
})
