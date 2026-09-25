import type { RouterOutputs } from "@/server/types"

export type SiteRecord = NonNullable<RouterOutputs["sites"]["get"]["project"]>
export type SiteVersion = RouterOutputs["sites"]["getHistory"][number]
export type PendingSiteProposal =
  RouterOutputs["sites"]["listPendingProposals"][number]
