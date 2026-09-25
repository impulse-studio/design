import { os } from "@orpc/server"
import { findActiveTeam } from "@/features/teams/repository.server"
import type { CurrentUser } from "@/features/auth/session.server"

export const activeTeamMiddleware = os
  .$context<{ user: CurrentUser }>()
  .middleware(async ({ context, next }) => {
    const team = await findActiveTeam(
      context.user.id,
      context.user.activeOrganizationId
    )
    return next({ context: { team } })
  })
