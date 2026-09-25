import { getDatabase } from "@/db/client.server"
import type { z } from "zod"
import type { setLibraryPermissionSchema } from "@/validators/libraries/requests"
import { requireLibraryAccess } from "./access.server"
import { updateLibraryPermission } from "./repository.server"
import { LibraryFailure } from "./errors"

export const setLibraryPermission = async (
  userId: string,
  input: z.infer<typeof setLibraryPermissionSchema>
) => {
  await getDatabase().transaction(async (tx) => {
    const access = await requireLibraryAccess(
      input.organizationId,
      userId,
      false,
      tx
    )
    if (access.role !== "owner")
      throw new LibraryFailure(
        "forbidden",
        "Seul un propriétaire peut attribuer cette permission."
      )
    const rows = await updateLibraryPermission(
      tx,
      input.organizationId,
      input.memberId,
      input.enabled
    )
    if (!rows.length) throw new LibraryFailure("not_found", "")
  })
}
