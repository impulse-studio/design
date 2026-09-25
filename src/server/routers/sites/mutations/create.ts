import { activeTeamMiddleware } from "@/server/middleware/active-team.middleware"
import { createSiteSchema } from "@/validators/sites/requests"

import { isTeamRole, roles } from "@/features/teams/permissions"
import { createSite } from "@/features/sites/create.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const createSiteHandler = protectedProcedure
  .input(createSiteSchema)
  .use(activeTeamMiddleware)
  .handler(async ({ context, errors, input }) => {
    const team = context.team
    if (
      !team ||
      !isTeamRole(team.role) ||
      !roles[team.role].authorize({ mockup: ["create"] }).success
    ) {
      throw errors.FORBIDDEN({ message: "Création non autorisée." })
    }

    try {
      const site = await createSite({
        name: input.name,
        organizationId: team.id,
        kind: input.kind,
      })
      return { id: site.id }
    } catch {
      throw errors.CONFLICT({
        message:
          "Le site n’a pas pu être créé. Vérifiez l’accès au registre npm et la base de données du Studio.",
      })
    }
  })
