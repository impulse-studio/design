import { requireActiveTeamId } from "@/features/teams/active.server"

import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { publishLibrary } from "@/features/libraries/service.server"

import { importLibrarySchema } from "@/validators/libraries/requests"

export const publishLibraryHandler = protectedProcedure
  .input(importLibrarySchema)
  .handler(async ({ context, input }) =>
    publishLibrary(
      await requireActiveTeamId(context.user),
      context.user.id,
      input
    )
  )
