import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { previewLibraryUpdate } from "@/features/libraries/service.server"

import { libraryUpdateSchema } from "@/validators/libraries/requests"

export const compareLibraryHandler = protectedProcedure
  .input(libraryUpdateSchema)
  .handler(async ({ context, input }) =>
    previewLibraryUpdate(context.user.id, input)
  )
