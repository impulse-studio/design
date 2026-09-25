import { z } from "zod"
import { mockupLinksSchema } from "@/features/mockups/schemas"
import { updateRecordLinks } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const updateMockupLinksHandler = protectedProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
      ...mockupLinksSchema.shape,
    })
  )
  .handler(({ context, input }) => updateRecordLinks(input, context.user.id))
