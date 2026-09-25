import { getSiteVersionSchema } from "@/validators/sites/requests"

import { getSiteVersion } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteVersionHandler = protectedProcedure
  .input(getSiteVersionSchema)
  .handler(({ context, input }) =>
    getSiteVersion(input.id, context.user.id, input.versionId)
  )
