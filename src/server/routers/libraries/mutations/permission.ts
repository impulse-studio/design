import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { setLibraryPermissionSchema } from "@/validators/libraries/requests"
import { setLibraryPermission } from "@/features/libraries/permissions.server"
import { LibraryFailure } from "@/features/libraries/errors"

export const permissionLibraryHandler = protectedProcedure
  .input(setLibraryPermissionSchema)
  .handler(async ({ context, input, errors }) => {
    try {
      await setLibraryPermission(context.user.id, input)
    } catch (error) {
      if (error instanceof LibraryFailure && error.kind === "forbidden")
        throw errors.FORBIDDEN({ message: error.message })
      if (error instanceof LibraryFailure && error.kind === "not_found")
        throw errors.NOT_FOUND()
      throw error
    }
    return { ok: true }
  })
