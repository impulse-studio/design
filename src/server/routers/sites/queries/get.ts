import { getSiteSchema } from "@/validators/sites/requests"

import { loadSite } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteHandler = protectedProcedure
  .input(getSiteSchema)
  .handler(({ context, input }) => loadSite(input.id, context.user.id))
