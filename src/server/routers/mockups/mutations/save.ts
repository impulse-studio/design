import { saveMockupSchema } from "@/validators/mockups"

import { saveRecord } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const saveMockupHandler = protectedProcedure
  .input(saveMockupSchema)
  .handler(({ context, input }) => saveRecord(input, context.user.id))
