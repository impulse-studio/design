import { base } from "@/server/context"
import { revokeMcpConnectionHandler } from "@/server/routers/mcp/mutations/revoke-connection"
import { listMcpConnectionsHandler } from "@/server/routers/mcp/queries/list-connections"

export const mcpRouter = base.router({
  listConnections: listMcpConnectionsHandler.route({ method: "GET" }),
  revokeConnection: revokeMcpConnectionHandler.route({ method: "POST" }),
})
