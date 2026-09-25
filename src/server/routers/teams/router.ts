import { base } from "@/server/context"
import { getOverviewHandler } from "@/server/routers/teams/queries/get-overview"

export const teamsRouter = base.router({
  getOverview: getOverviewHandler.route({ method: "GET" }),
})
