import { createFileRoute } from "@tanstack/react-router"
import { DesignSystemLayout } from "@/pages/design-system/layout"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/design-system")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  component: DesignSystemLayout,
})
