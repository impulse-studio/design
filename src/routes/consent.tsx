import { consentSearchSchema } from "@/validators/oauth"
import { createFileRoute } from "@tanstack/react-router"

import { ConsentPage } from "@/pages/oauth/page"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/consent")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  validateSearch: consentSearchSchema,
  component: ConsentPage,
})
