import { changeSiteSchema } from "@/validators/sites/requests"

import { saveSiteChange } from "@/features/sites/repository.server"

import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { SiteFailure } from "@/features/sites/errors"

export const changeSiteHandler = protectedProcedure
  .input(changeSiteSchema)
  .handler(async ({ context, errors, input }) => {
    try {
      return await saveSiteChange(
        input.id,
        context.user.id,
        input.expectedRevision,
        input.change
      )
    } catch (error) {
      if (error instanceof SiteFailure && error.kind === "forbidden")
        throw errors.FORBIDDEN({ message: error.message })
      if (error instanceof SiteFailure)
        throw errors.CONFLICT({ message: error.message })
      throw error
    }
  })
