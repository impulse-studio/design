import { z } from "zod"
import { getSiteProposals } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const listPendingSiteProposalsHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(({ context, input }) => getSiteProposals(input.id, context.user.id))
