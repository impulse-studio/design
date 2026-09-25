import { v4 as uuid } from "uuid"
import { createHash, randomBytes } from "node:crypto"
import { and, eq, isNull } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { libraryConnections, teamLibraries } from "@/db/schema"
import { LibraryFailure } from "./errors"
import { publishLibrary } from "@/features/libraries/service.server"
import { requireLibraryAccess } from "@/features/libraries/access.server"
import { libraryPayloadSchema } from "@/validators/libraries/payload"

const hash = (value: string) => createHash("sha256").update(value).digest("hex")
const requireConnectionAccess = async (
  organizationId: string,
  userId: string
) => {
  try {
    return await requireLibraryAccess(organizationId, userId, true)
  } catch {
    throw new LibraryFailure(
      "forbidden",
      "Accès aux bibliothèques non autorisé."
    )
  }
}

export const createLibraryConnection = async (
  libraryId: string,
  organizationId: string,
  userId: string
) => {
  await requireConnectionAccess(organizationId, userId)
  const library = await getDatabase()
    .select()
    .from(teamLibraries)
    .where(
      and(
        eq(teamLibraries.id, libraryId),
        eq(teamLibraries.organizationId, organizationId)
      )
    )
    .then((rows) => rows.at(0))
  if (!library)
    throw new LibraryFailure("not_found", "Bibliothèque introuvable.")
  const code = randomBytes(24).toString("base64url")
  const expiresAt = new Date(Date.now() + 10 * 60_000)
  const id = uuid()
  await getDatabase()
    .insert(libraryConnections)
    .values({ id, libraryId, userId, tokenHash: hash(code), expiresAt })
  return { id, code, expiresAt }
}

export const revokeLibraryConnection = async (
  id: string,
  organizationId: string,
  userId: string
) => {
  await requireConnectionAccess(organizationId, userId)
  const row = await getDatabase()
    .select({ connection: libraryConnections })
    .from(libraryConnections)
    .innerJoin(
      teamLibraries,
      eq(teamLibraries.id, libraryConnections.libraryId)
    )
    .where(
      and(
        eq(libraryConnections.id, id),
        eq(teamLibraries.organizationId, organizationId)
      )
    )
    .then((rows) => rows.at(0))
  if (!row) throw new LibraryFailure("not_found", "Connexion introuvable.")
  await getDatabase()
    .update(libraryConnections)
    .set({ revokedAt: new Date() })
    .where(eq(libraryConnections.id, id))
}

export const handleLibrarySync = async (request: Request) => {
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ?? ""
  if (!token || token.length > 200)
    return Response.json({ error: "Connexion requise." }, { status: 401 })
  const row = await getDatabase()
    .select({ connection: libraryConnections, library: teamLibraries })
    .from(libraryConnections)
    .innerJoin(
      teamLibraries,
      eq(teamLibraries.id, libraryConnections.libraryId)
    )
    .where(
      and(
        eq(libraryConnections.tokenHash, hash(token)),
        isNull(libraryConnections.revokedAt)
      )
    )
    .then((rows) => rows.at(0))
  if (!row || row.connection.expiresAt.getTime() < Date.now())
    return Response.json(
      { error: "Connexion expirée ou révoquée." },
      { status: 401 }
    )
  const { connection, library } = row
  try {
    await requireConnectionAccess(library.organizationId, connection.userId)
    if (!connection.claimed) {
      const nextToken = randomBytes(32).toString("base64url")
      const claimed = await getDatabase()
        .update(libraryConnections)
        .set({
          claimed: true,
          tokenHash: hash(nextToken),
          expiresAt: new Date(Date.now() + 30 * 86_400_000),
          lastSeenAt: new Date(),
        })
        .where(
          and(
            eq(libraryConnections.id, connection.id),
            eq(libraryConnections.claimed, false)
          )
        )
        .returning({ id: libraryConnections.id })
      if (!claimed.length)
        throw new LibraryFailure("conflict", "Code déjà utilisé.")
      return Response.json({
        token: nextToken,
        framework: library.framework,
        version: library.version,
      })
    }
    await getDatabase()
      .update(libraryConnections)
      .set({ lastSeenAt: new Date() })
      .where(eq(libraryConnections.id, connection.id))
    if (request.method === "GET")
      return Response.json({
        framework: library.framework,
        version: library.version,
      })
    if (Number(request.headers.get("content-length")) > 12_000_000)
      return Response.json(
        { error: "Import trop volumineux." },
        { status: 413 }
      )
    const reader = request.body?.getReader()
    if (!reader) throw new LibraryFailure("invalid", "Contenu absent.")
    const chunks: Uint8Array[] = []
    let size = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 12_000_000) {
        await reader.cancel()
        return Response.json(
          { error: "Import trop volumineux." },
          { status: 413 }
        )
      }
      chunks.push(value)
    }
    const body = Buffer.concat(chunks).toString("utf8")
    const payload = libraryPayloadSchema.parse(JSON.parse(body))
    const digest = hash(JSON.stringify(payload))
    if (connection.digest === digest)
      return Response.json({ version: library.version, unchanged: true })
    const snapshot = await publishLibrary(
      library.organizationId,
      connection.userId,
      {
        name: library.name,
        libraryId: library.id,
        expectedVersion: library.version,
        payload,
      }
    )
    await getDatabase()
      .update(libraryConnections)
      .set({ digest, error: null, lastSuccessAt: new Date() })
      .where(eq(libraryConnections.id, connection.id))
    return Response.json({ version: snapshot.version })
  } catch (error) {
    const failure =
      error instanceof LibraryFailure
        ? error
        : new LibraryFailure("conflict", "Synchronisation impossible.")
    const message = failure.message.slice(0, 2000)
    await getDatabase()
      .update(libraryConnections)
      .set({ error: message })
      .where(eq(libraryConnections.id, connection.id))
    return Response.json(
      { error: message, kind: failure.kind },
      { status: failure.kind === "forbidden" ? 403 : 409 }
    )
  }
}
