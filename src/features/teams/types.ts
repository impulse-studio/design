import type { InferRouterOutputs } from "@orpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type TeamOverview = InferRouterOutputs<AppRouter>["teams"]["getOverview"]
export type TeamSummary = TeamOverview["teams"][number]
export type TeamMember = TeamOverview["members"][number]
