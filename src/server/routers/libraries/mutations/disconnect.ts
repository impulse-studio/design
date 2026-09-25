import { disconnectLibrarySchema } from "@/validators/libraries/requests"
import { requireActiveTeamId } from "@/features/teams/active.server"
import { mapConnectionFailure } from "@/server/routers/libraries/errors"

import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { revokeLibraryConnection } from "@/features/libraries/connections.server"

export const disconnectLibraryHandler = protectedProcedure
  .input(disconnectLibrarySchema)
  .handler(async ({ context, input, errors }) => {
    try {
      return await revokeLibraryConnection(
        input.id,
        await requireActiveTeamId(context.user),
        context.user.id
      )
    } catch (error) {
      return mapConnectionFailure(error, errors)
    }
  })
