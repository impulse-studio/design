import { z } from "zod"
import { siteHistory } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteHistoryHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(({ context, input }) => siteHistory(input.id, context.user.id))
