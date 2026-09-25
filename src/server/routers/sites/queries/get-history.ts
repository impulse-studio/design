import { getSiteHistorySchema } from "@/validators/sites/requests"

import { siteHistory } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteHistoryHandler = protectedProcedure
  .input(getSiteHistorySchema)
  .handler(({ context, input }) => siteHistory(input.id, context.user.id))
