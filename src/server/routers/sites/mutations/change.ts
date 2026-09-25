import { z } from "zod"
import { saveSiteChange } from "@/features/sites/repository.server"
import { siteChangeSchema } from "@/features/sites/schema"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const changeSiteHandler = protectedProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
      expectedRevision: z.number().int().nonnegative(),
      change: siteChangeSchema,
    })
  )
  .handler(async ({ context, errors, input }) => {
    try {
      return await saveSiteChange(
        input.id,
        context.user.id,
        input.expectedRevision,
        input.change
      )
    } catch (error) {
      if (error instanceof Error) {
        if (/lecture seule|non autorisé/i.test(error.message)) {
          throw errors.FORBIDDEN({ message: error.message })
        }
        throw errors.CONFLICT({ message: error.message })
      }
      throw error
    }
  })
