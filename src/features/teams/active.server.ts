import { findActiveTeam } from "@/features/teams/repository.server"

import type { CurrentUser } from "@/features/auth/session.server"

export const requireActiveTeamId = async (user: CurrentUser) => {
  const team = await findActiveTeam(user.id, user.activeOrganizationId)
  if (!team) throw new Error("Sélectionnez une équipe.")
  return team.id
}
