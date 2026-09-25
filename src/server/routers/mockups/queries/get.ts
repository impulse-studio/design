import { z } from "zod"
import { findSite } from "@/features/sites/repository.server"
import { loadRecord } from "@/features/mockups/repository.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const getMockupHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(async ({ context, input }) => {
    const record = await loadRecord(input.id, context.user.id)
    return { ...record, site: await findSite(input.id) }
  })
