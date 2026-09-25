import type { Database, Transaction } from "@/db/types"

import { and, desc, eq, isNull } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import {
  member,
  mockups,
  teamLibraries,
  libraryVersions,
  libraryConnections,
  siteProjects,
} from "@/db/schema"

import { librarySnapshotSchema } from "@/validators/libraries/payload"
import type { importLibrarySchema } from "@/validators/libraries/requests"
import type { z } from "zod"
import type { LibrarySnapshot } from "@/validators/libraries/payload"

export const findLibraryMembership = async (
  organizationId: string,
  userId: string,
  db: Database | Transaction = getDatabase()
) => {
  const query = db
    .select()
    .from(member)
    .where(
      and(eq(member.organizationId, organizationId), eq(member.userId, userId))
    )
  const row = await ("rollback" in db ? query.for("share") : query).then(
    (rows) => rows.at(0)
  )
  return row
}

export const listLibraryRecords = async (organizationId: string) => {
  const libraries = await getDatabase()
    .select()
    .from(teamLibraries)
    .where(eq(teamLibraries.organizationId, organizationId))
    .orderBy(desc(teamLibraries.updatedAt))
  const items = await Promise.all(
    libraries.map(async (library) => {
      const latest = await getDatabase()
        .select({ snapshot: libraryVersions.snapshot })
        .from(libraryVersions)
        .where(
          and(
            eq(libraryVersions.libraryId, library.id),
            eq(libraryVersions.version, library.version)
          )
        )
        .then((rows) => rows.at(0)?.snapshot ?? null)
      const connections = await getDatabase()
        .select({
          id: libraryConnections.id,
          userId: libraryConnections.userId,
          claimed: libraryConnections.claimed,
          lastSeenAt: libraryConnections.lastSeenAt,
          lastSuccessAt: libraryConnections.lastSuccessAt,
          error: libraryConnections.error,
          expiresAt: libraryConnections.expiresAt,
        })
        .from(libraryConnections)
        .where(
          and(
            eq(libraryConnections.libraryId, library.id),
            isNull(libraryConnections.revokedAt)
          )
        )
      return { ...library, latest, connections }
    })
  )
  return items
}

export const persistLibrarySnapshot = async (
  tx: Transaction,
  organizationId: string,
  userId: string,
  input: z.infer<typeof importLibrarySchema>,
  snapshot: LibrarySnapshot
) => {
  const libraryId = snapshot.libraryId
  const payload = snapshot.payload
  if (input.libraryId) {
    const library = await tx
      .select()
      .from(teamLibraries)
      .where(
        and(
          eq(teamLibraries.id, libraryId),
          eq(teamLibraries.organizationId, organizationId)
        )
      )
      .for("update")
      .then((rows) => rows.at(0))
    if (!library) throw new Error("Bibliothèque introuvable.")
    if (library.version !== input.expectedVersion)
      throw new Error("La bibliothèque a changé. Rechargez avant de publier.")
    if (library.framework !== payload.framework)
      throw new Error("Le framework d’une bibliothèque ne peut pas changer.")
    await tx
      .update(teamLibraries)
      .set({
        name: input.name,
        version: snapshot.version,
        updatedAt: new Date(),
      })
      .where(eq(teamLibraries.id, libraryId))
  } else {
    if (input.expectedVersion !== 0)
      throw new Error("Version initiale invalide.")
    await tx.insert(teamLibraries).values({
      id: libraryId,
      organizationId,
      name: input.name,
      framework: payload.framework,
      version: 1,
    })
  }
  await tx.insert(libraryVersions).values({
    id: snapshot.id,
    libraryId,
    version: snapshot.version,
    snapshot,
    createdBy: userId,
  })
}

export const findLibraryVersion = async (
  versionId: string,
  organizationId: string
) => {
  const row = await getDatabase()
    .select({ snapshot: libraryVersions.snapshot })
    .from(libraryVersions)
    .innerJoin(teamLibraries, eq(teamLibraries.id, libraryVersions.libraryId))
    .where(
      and(
        eq(libraryVersions.id, versionId),
        eq(teamLibraries.organizationId, organizationId)
      )
    )
    .then((rows) => rows.at(0))
  if (!row) throw new Error("Version de bibliothèque introuvable.")
  return librarySnapshotSchema.parse(row.snapshot)
}

export const findProjectOrganization = async (id: string) => {
  const row = await getDatabase()
    .select({ organizationId: mockups.organizationId })
    .from(mockups)
    .where(eq(mockups.id, id))
    .then((rows) => rows.at(0))
  return row
}

export const findLibraryProject = (id: string) =>
  getDatabase()
    .select()
    .from(siteProjects)
    .where(eq(siteProjects.id, id))
    .then((rows) => rows.at(0))

export const updateLibraryPermission = (
  tx: Transaction,
  organizationId: string,
  memberId: string,
  enabled: boolean
) =>
  tx
    .update(member)
    .set({ canManageLibraries: enabled })
    .where(
      and(eq(member.id, memberId), eq(member.organizationId, organizationId))
    )
    .returning({ id: member.id })
