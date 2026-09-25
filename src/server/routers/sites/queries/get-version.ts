import { z } from "zod"
import { getSiteVersion } from "@/features/sites/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getSiteVersionHandler = protectedProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
      versionId: z.string().uuid(),
    })
  )
  .handler(({ context, input }) =>
    getSiteVersion(input.id, context.user.id, input.versionId)
  )
