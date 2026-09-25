import { getMockupRevisionSchema } from "@/validators/mockups"

import { loadRecordRevision } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getMockupRevisionHandler = protectedProcedure
  .input(getMockupRevisionSchema)
  .handler(({ context, input }) =>
    loadRecordRevision(input.id, context.user.id)
  )
