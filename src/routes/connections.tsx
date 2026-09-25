import { createFileRoute } from "@tanstack/react-router"
import { ConnectionsPage } from "@/pages/connections/ConnectionsPage"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/connections")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      context.orpc.mcp.listConnections.queryOptions()
    ),
  component: ConnectionsPage,
})
