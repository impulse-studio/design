import { createSiteDocument } from "@/features/sites/scaffold.server"
import { isTeamRole, roles } from "@/features/teams/permissions"
import { activeTeamMiddleware } from "@/server/middleware/active-team.middleware"
import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { siteKindSchema } from "@/validators/sites/kind"

export const scaffoldSiteHandler = protectedProcedure
  .input(siteKindSchema)
  .use(activeTeamMiddleware)
  .handler(async ({ context, input, errors }) => {
    const team = context.team
    if (
      !team ||
      !isTeamRole(team.role) ||
      !roles[team.role].authorize({ mockup: ["create"] }).success
    )
      throw errors.FORBIDDEN({ message: "Création non autorisée." })
    return createSiteDocument(input)
  })
