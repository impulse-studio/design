import type { RouterOutputs } from "@/server/types"

export type TeamOverview = RouterOutputs["teams"]["getOverview"]
export type TeamSummary = TeamOverview["teams"][number]
export type TeamMember = TeamOverview["members"][number]
