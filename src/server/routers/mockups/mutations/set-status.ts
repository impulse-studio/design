import { z } from "zod"
import { mockupStatusSchema } from "@/features/mockups/status"
import { updateRecordStatus } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const setMockupStatusHandler = protectedProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
      status: mockupStatusSchema,
      expectedRevision: z.number().int().nonnegative(),
    })
  )
  .handler(({ context, input }) => updateRecordStatus(input, context.user.id))
