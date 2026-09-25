import { setMockupStatusSchema } from "@/validators/mockups"

import { updateRecordStatus } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const setMockupStatusHandler = protectedProcedure
  .input(setMockupStatusSchema)
  .handler(({ context, input }) => updateRecordStatus(input, context.user.id))
