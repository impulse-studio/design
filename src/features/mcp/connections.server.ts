import type { McpRevocationCleanupRow } from "@/db/schema/mcp"
import { and, eq } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import {
  mcpRevocationCleanup,
  oauthAccessToken,
  oauthClient,
  oauthConsent,
  oauthRefreshToken,
} from "@/db/schema"
import { getAuth } from "@/features/auth/auth.server"

export type McpRevocationResult = {
  status: "revoked" | "revoked_cleanup_pending"
}

const cleanupTokens = async (userId: string, clientId: string) => {
  await getDatabase().transaction(async (tx) => {
    await tx
      .delete(oauthAccessToken)
      .where(
        and(
          eq(oauthAccessToken.userId, userId),
          eq(oauthAccessToken.clientId, clientId)
        )
      )
    await tx
      .delete(oauthRefreshToken)
      .where(
        and(
          eq(oauthRefreshToken.userId, userId),
          eq(oauthRefreshToken.clientId, clientId)
        )
      )
  })
}

const retryCleanup = async (
  cleanup: McpRevocationCleanupRow,
  headers: Headers
): Promise<McpRevocationResult> => {
  const db = getDatabase()
  const consentExists = await db
    .select({ id: oauthConsent.id })
    .from(oauthConsent)
    .where(
      and(
        eq(oauthConsent.id, cleanup.id),
        eq(oauthConsent.userId, cleanup.userId)
      )
    )
    .then((rows) => Boolean(rows[0]))
  let consentRemoved = !consentExists
  if (consentExists)
    try {
      await getAuth().api.deleteOAuthConsent({
        body: { id: cleanup.id },
        headers,
      })
      consentRemoved = true
    } catch {
      consentRemoved = false
    }

  let tokensRemoved = false
  try {
    await cleanupTokens(cleanup.userId, cleanup.clientId)
    tokensRemoved = true
  } catch {
    tokensRemoved = false
  }

  if (consentRemoved && tokensRemoved) {
    await db
      .delete(mcpRevocationCleanup)
      .where(eq(mcpRevocationCleanup.id, cleanup.id))
    return { status: "revoked" }
  }
  await db
    .update(mcpRevocationCleanup)
    .set({ updatedAt: new Date() })
    .where(eq(mcpRevocationCleanup.id, cleanup.id))
  return { status: "revoked_cleanup_pending" }
}

export const listMcpConnections = async (userId: string, headers: Headers) => {
  const db = getDatabase()
  const pending = await db
    .select()
    .from(mcpRevocationCleanup)
    .where(eq(mcpRevocationCleanup.userId, userId))
  await Promise.all(pending.map((cleanup) => retryCleanup(cleanup, headers)))
  const stillPending = new Set(
    (
      await db
        .select({ clientId: mcpRevocationCleanup.clientId })
        .from(mcpRevocationCleanup)
        .where(eq(mcpRevocationCleanup.userId, userId))
    ).map((row) => row.clientId)
  )
  const rows = await db
    .select({
      id: oauthConsent.id,
      name: oauthClient.name,
      clientId: oauthConsent.clientId,
      scopes: oauthConsent.scopes,
      createdAt: oauthConsent.createdAt,
    })
    .from(oauthConsent)
    .innerJoin(oauthClient, eq(oauthClient.clientId, oauthConsent.clientId))
    .where(eq(oauthConsent.userId, userId))
  return rows
    .filter(
      (row) =>
        !stillPending.has(row.clientId) &&
        row.scopes.some((scope) => scope.startsWith("mcp:"))
    )
    .map((row) => ({
      ...row,
      createdAt: row.createdAt?.toISOString() ?? null,
    }))
}

export const hasCurrentMcpAccess = async (
  userId: string,
  clientId: string,
  grantedScopes: string[]
) => {
  const db = getDatabase()
  const pending = await db
    .select({ id: mcpRevocationCleanup.id })
    .from(mcpRevocationCleanup)
    .where(
      and(
        eq(mcpRevocationCleanup.userId, userId),
        eq(mcpRevocationCleanup.clientId, clientId)
      )
    )
    .limit(1)
  if (pending.length) return false
  const consents = await db
    .select({ scopes: oauthConsent.scopes })
    .from(oauthConsent)
    .where(
      and(eq(oauthConsent.userId, userId), eq(oauthConsent.clientId, clientId))
    )
  return consents.some((consent) =>
    grantedScopes.every((scope) => consent.scopes.includes(scope))
  )
}

export const revokeMcpConnection = async (
  userId: string,
  id: string,
  headers: Headers
): Promise<McpRevocationResult | null> => {
  const db = getDatabase()
  let cleanup = await db
    .select()
    .from(mcpRevocationCleanup)
    .where(
      and(
        eq(mcpRevocationCleanup.id, id),
        eq(mcpRevocationCleanup.userId, userId)
      )
    )
    .then((rows) => rows.at(0))
  if (!cleanup) {
    const consent = await db
      .select({ clientId: oauthConsent.clientId })
      .from(oauthConsent)
      .where(and(eq(oauthConsent.id, id), eq(oauthConsent.userId, userId)))
      .limit(1)
      .then((rows) => rows.at(0))
    if (!consent) return null
    const created = await db
      .insert(mcpRevocationCleanup)
      .values({ id, userId, clientId: consent.clientId })
      .onConflictDoUpdate({
        target: mcpRevocationCleanup.id,
        set: { updatedAt: new Date() },
      })
      .returning()
      .then((rows) => rows.at(0))
    if (!created) throw new Error("Revocation cleanup invariant failed")
    cleanup = created
  }
  return retryCleanup(cleanup, headers)
}
