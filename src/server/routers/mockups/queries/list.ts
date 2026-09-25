import {
  findActiveTeam,
  listTeamsForUser,
} from "@/features/teams/repository.server"
import { canEditMockups } from "@/features/teams/permissions"
import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { listRecords } from "@/features/mockups/repository.server"

export const listMockupsHandler = protectedProcedure.handler(
  async ({ context, errors }) => {
    const team = await findActiveTeam(
      context.user.id,
      context.user.activeOrganizationId
    )
    if (!team) throw errors.TEAM_REQUIRED()

    const teams = await listTeamsForUser(context.user.id)
    try {
      return {
        records: await listRecords(context.user.id, team.id),
        team,
        teams,
        canEdit: canEditMockups(team.role),
        error: null,
      }
    } catch {
      return {
        records: [],
        team,
        teams,
        canEdit: canEditMockups(team.role),
        error:
          "La base de données est indisponible. Démarrez PostgreSQL puis réessayez.",
      }
    }
  }
)
