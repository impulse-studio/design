import { getTeamOverview } from "@/features/teams/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getOverviewHandler = protectedProcedure.handler(({ context }) =>
  getTeamOverview(context.user)
)
