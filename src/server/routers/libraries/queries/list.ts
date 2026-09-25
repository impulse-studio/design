import { listLibrariesSchema } from "@/validators/libraries/requests"
import { requireActiveTeamId } from "@/features/teams/active.server"

import { protectedProcedure } from "@/server/procedure/protected.procedure"

import { listLibraries } from "@/features/libraries/service.server"
import { projectOrganization } from "@/features/libraries/access.server"

export const listLibraryHandler = protectedProcedure
  .input(listLibrariesSchema)
  .handler(async ({ context, input }) =>
    listLibraries(
      input.projectId
        ? await projectOrganization(input.projectId, context.user.id)
        : await requireActiveTeamId(context.user),
      context.user.id
    )
  )
