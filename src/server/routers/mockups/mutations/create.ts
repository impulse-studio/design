import { activeTeamMiddleware } from "@/server/middleware/active-team.middleware"

import { createRecord } from "@/features/mockups/repository.server"
import { mockupNameFormSchema } from "@/validators/mockups"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const createMockupHandler = protectedProcedure
  .input(mockupNameFormSchema)
  .use(activeTeamMiddleware)
  .handler(async ({ context, errors, input }) => {
    const team = context.team
    if (!team) throw errors.TEAM_REQUIRED()
    return createRecord(input.name, context.user.id, team.id)
  })
