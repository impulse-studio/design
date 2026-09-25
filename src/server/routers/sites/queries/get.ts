import { z } from "zod"
import { loadSite } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(({ context, input }) => loadSite(input.id, context.user.id))
