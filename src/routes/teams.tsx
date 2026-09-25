import { createFileRoute } from "@tanstack/react-router"
import { TeamsPage } from "@/pages/teams/TeamsPage"
import { PROJECT_NAME } from "@/constants"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/teams")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      context.orpc.teams.getOverview.queryOptions()
    ),
  component: TeamsPage,
  head: () => ({ meta: [{ title: `Équipes et membres — ${PROJECT_NAME}` }] }),
})
