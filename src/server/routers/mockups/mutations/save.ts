import { documentSchema } from "@digit-ai-studio/shared"
import { z } from "zod"
import { mockupStatusSchema } from "@/features/mockups/status"
import { mockupNameSchema } from "@/features/mockups/schemas"
import { saveRecord } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const saveMockupHandler = protectedProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
      name: mockupNameSchema,
      status: mockupStatusSchema,
      doc: documentSchema,
      expectedRevision: z.number().int().nonnegative(),
    })
  )
  .handler(({ context, input }) => saveRecord(input, context.user.id))
