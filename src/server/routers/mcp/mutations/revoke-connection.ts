import { revokeMcpConnectionSchema } from "@/validators/mcp"

import { revokeMcpConnection } from "@/features/mcp/connections.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const revokeMcpConnectionHandler = protectedProcedure
  .input(revokeMcpConnectionSchema)
  .handler(async ({ context, errors, input }) => {
    const result = await revokeMcpConnection(
      context.user.id,
      input.id,
      context.headers
    )
    if (!result) throw errors.NOT_FOUND({ message: "Connexion introuvable." })
    return result
  })
