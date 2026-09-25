import { listMcpConnections } from "@/features/mcp/connections.server"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const listMcpConnectionsHandler = protectedProcedure.handler(
  async ({ context }) => listMcpConnections(context.user.id, context.headers)
)
