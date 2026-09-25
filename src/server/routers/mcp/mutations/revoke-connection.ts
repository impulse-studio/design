import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { getAuth } from "@/features/auth/auth.server"
import { oauthAccessToken, oauthConsent, oauthRefreshToken } from "@/db/schema"
import { protectedProcedure } from "@/server/procedure/protected.procedure"

export const revokeMcpConnectionHandler = protectedProcedure
  .input(z.object({ id: z.string().min(1).max(100) }))
  .handler(async ({ context, errors, input }) => {
    const row = await context.db
      .select({ clientId: oauthConsent.clientId })
      .from(oauthConsent)
      .where(
        and(
          eq(oauthConsent.id, input.id),
          eq(oauthConsent.userId, context.user.id)
        )
      )
      .limit(1)
      .then((rows) => rows.at(0))

    if (!row) throw errors.NOT_FOUND({ message: "Connexion introuvable." })
    await getAuth().api.deleteOAuthConsent({
      body: { id: input.id },
      headers: context.headers,
    })
    await context.db.transaction(async (tx) => {
      await tx
        .delete(oauthAccessToken)
        .where(
          and(
            eq(oauthAccessToken.userId, context.user.id),
            eq(oauthAccessToken.clientId, row.clientId)
          )
        )
      await tx
        .delete(oauthRefreshToken)
        .where(
          and(
            eq(oauthRefreshToken.userId, context.user.id),
            eq(oauthRefreshToken.clientId, row.clientId)
          )
        )
    })
    return { ok: true }
  })
