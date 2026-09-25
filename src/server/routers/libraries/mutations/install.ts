import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { installLibrary } from "@/features/libraries/service.server"

import { libraryUpdateSchema } from "@/validators/libraries/requests"

export const installLibraryHandler = protectedProcedure
  .input(libraryUpdateSchema)
  .handler(async ({ context, input }) => installLibrary(context.user.id, input))
