import { createFileRoute } from "@tanstack/react-router"
import { StudioPage } from "@/pages/studio/page"
import { PROJECT_NAME } from "@/constants"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(context.orpc.mockups.list.queryOptions()),
  component: StudioPage,
  head: () => ({ meta: [{ title: `${PROJECT_NAME} — Vos maquettes` }] }),
})
