import { connectLibrarySchema } from "@/validators/libraries/requests"
import { requireActiveTeamId } from "@/features/teams/active.server"
import { mapConnectionFailure } from "@/server/routers/libraries/errors"

import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { createLibraryConnection } from "@/features/libraries/connections.server"

export const connectLibraryHandler = protectedProcedure
  .input(connectLibrarySchema)
  .handler(async ({ context, input, errors }) => {
    try {
      return await createLibraryConnection(
        input.libraryId,
        await requireActiveTeamId(context.user),
        context.user.id
      )
    } catch (error) {
      return mapConnectionFailure(error, errors)
    }
  })
