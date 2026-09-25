import { z } from "zod"
import { loadRecordRevision } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getMockupRevisionHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(({ context, input }) =>
    loadRecordRevision(input.id, context.user.id)
  )
