import { eq } from "drizzle-orm"
import { oauthClient, oauthConsent } from "@/db/schema"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const listMcpConnectionsHandler = protectedProcedure.handler(
  async ({ context }) => {
    const rows = await context.db
      .select({
        id: oauthConsent.id,
        name: oauthClient.name,
        clientId: oauthConsent.clientId,
        scopes: oauthConsent.scopes,
        createdAt: oauthConsent.createdAt,
      })
      .from(oauthConsent)
      .innerJoin(oauthClient, eq(oauthClient.clientId, oauthConsent.clientId))
      .where(eq(oauthConsent.userId, context.user.id))
    return rows
      .filter((row) => row.scopes.some((scope) => scope.startsWith("mcp:")))
      .map((row) => ({
        ...row,
        createdAt: row.createdAt?.toISOString() ?? null,
      }))
  }
)
