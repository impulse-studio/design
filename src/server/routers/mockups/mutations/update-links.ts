import { updateMockupLinksSchema } from "@/validators/mockups"

import { updateRecordLinks } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const updateMockupLinksHandler = protectedProcedure
  .input(updateMockupLinksSchema)
  .handler(({ context, input }) => updateRecordLinks(input, context.user.id))
