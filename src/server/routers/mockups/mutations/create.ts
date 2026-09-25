import { findActiveTeam } from "@/features/teams/repository.server"
import { createRecord } from "@/features/mockups/repository.server"
import { mockupNameFormSchema } from "@/features/mockups/schemas"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const createMockupHandler = protectedProcedure
  .input(mockupNameFormSchema)
  .handler(async ({ context, errors, input }) => {
    const team = await findActiveTeam(
      context.user.id,
      context.user.activeOrganizationId
    )
    if (!team) throw errors.TEAM_REQUIRED()
    return createRecord(input.name, context.user.id, team.id)
  })
