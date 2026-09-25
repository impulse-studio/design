import { listPendingSiteProposalsSchema } from "@/validators/sites/requests"

import { getSiteProposals } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const listPendingSiteProposalsHandler = protectedProcedure
  .input(listPendingSiteProposalsSchema)
  .handler(({ context, input }) => getSiteProposals(input.id, context.user.id))
