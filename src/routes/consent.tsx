import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { ConsentPage } from "@/pages/oauth/ConsentPage"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route = createFileRoute("/consent")({
  beforeLoad: ({ context, location }) =>
    requireAuthenticatedUser(context.user, location.pathname),
  validateSearch: z.object({
    client_id: z.string().optional(),
    scope: z.string().optional(),
  }),
  component: ConsentPage,
})
