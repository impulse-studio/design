import { v4 as uuid } from "uuid"
import type { MockupRow } from "@/db/schema/mockups"
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { member, mockups } from "@/db/schema"
import { roles } from "@/features/teams/permissions"
import { validateDocument } from "@digit-ai-studio/shared"
import { library } from "@/features/editor/library"
import { emptyDocument } from "@/features/editor/document"
import type {
  MockupStatus,
  saveMockupSchema,
  updateMockupLinksSchema,
} from "@/validators/mockups"
import type { z } from "zod"

const authorizedOrganizations = (
  userId: string,
  action: "read" | "create" | "update"
) =>
  getDatabase()
    .select({ id: member.organizationId })
    .from(member)
    .where(
      and(
        eq(member.userId, userId),
        inArray(
          member.role,
          Object.entries(roles)
            .filter(([, role]) => role.authorize({ mockup: [action] }).success)
            .map(([role]) => role)
        )
      )
    )

const record = (row: MockupRow) => ({
  id: row.id,
  name: row.name,
  notionUrl: row.notionUrl,
  githubUrl: row.githubUrl,
  status: row.status,
  doc: validateDocument(row.doc, library),
  revision: row.revision,
  updatedAt: row.updatedAt.toISOString(),
})
export const listRecords = async (userId: string, organizationId: string) => {
  const rows = await getDatabase()
    .select({
      id: mockups.id,
      name: mockups.name,
      notionUrl: mockups.notionUrl,
      githubUrl: mockups.githubUrl,
      status: mockups.status,
      revision: mockups.revision,
      updatedAt: mockups.updatedAt,
    })
    .from(mockups)
    .where(
      and(
        isNull(mockups.deletedAt),
        eq(mockups.organizationId, organizationId),
        inArray(mockups.organizationId, authorizedOrganizations(userId, "read"))
      )
    )
    .orderBy(desc(mockups.updatedAt))
    .limit(100)
  return rows.map((row) => ({ ...row, updatedAt: row.updatedAt.toISOString() }))
}
export const createRecord = async (
  name: string,
  userId: string,
  organizationId: string
) => {
  const allowed = await authorizedOrganizations(userId, "create")
  if (!allowed.some((team) => team.id === organizationId))
    throw new Error("Vous ne pouvez pas créer de maquette dans cette équipe.")
  const rows = await getDatabase()
    .insert(mockups)
    .values({
      id: uuid(),
      name,
      organizationId,
      doc: emptyDocument(),
      libVersion: library.orchestrationSha,
    })
    .returning()
  return record(rows[0])
}
export const loadRecord = async (id: string, userId: string) => {
  const rows = await getDatabase()
    .select()
    .from(mockups)
    .where(
      and(
        eq(mockups.id, id),
        isNull(mockups.deletedAt),
        inArray(mockups.organizationId, authorizedOrganizations(userId, "read"))
      )
    )
    .limit(1)
  const row = rows.at(0)
  if (!row) throw new Error("Maquette introuvable")
  const canEdit = (await authorizedOrganizations(userId, "update")).some(
    (team) => team.id === row.organizationId
  )
  return { ...record(row), canEdit }
}
export const loadRecordRevision = async (id: string, userId: string) => {
  const rows = await getDatabase()
    .select({ revision: mockups.revision })
    .from(mockups)
    .where(
      and(
        eq(mockups.id, id),
        isNull(mockups.deletedAt),
        inArray(mockups.organizationId, authorizedOrganizations(userId, "read"))
      )
    )
    .limit(1)
  if (!rows[0]) throw new Error("Maquette introuvable")
  return rows[0]
}
export const saveRecord = async (
  input: z.infer<typeof saveMockupSchema>,
  userId: string
) => {
  const doc = validateDocument(input.doc, library)
  const savedRows = await getDatabase()
    .update(mockups)
    .set({
      name: input.name,
      status: input.status,
      doc,
      libVersion: doc.libVersion,
      revision: sql`${mockups.revision} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mockups.id, input.id),
        inArray(
          mockups.organizationId,
          authorizedOrganizations(userId, "update")
        ),
        eq(mockups.revision, input.expectedRevision),
        isNull(mockups.deletedAt)
      )
    )
    .returning({ revision: mockups.revision, updatedAt: mockups.updatedAt })
  const saved = savedRows.at(0)
  if (saved)
    return {
      status: "saved" as const,
      revision: saved.revision,
      updatedAt: saved.updatedAt.toISOString(),
    }
  const existing = await loadRecord(input.id, userId)
  if (!existing.canEdit) throw new Error("Cette maquette est en lecture seule.")
  return { status: "conflict" as const, revision: existing.revision }
}

export const updateRecordLinks = async (
  input: z.infer<typeof updateMockupLinksSchema>,
  userId: string
) => {
  const savedRows = await getDatabase()
    .update(mockups)
    .set({
      notionUrl: input.notionUrl,
      githubUrl: input.githubUrl,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mockups.id, input.id),
        inArray(
          mockups.organizationId,
          authorizedOrganizations(userId, "update")
        ),
        isNull(mockups.deletedAt)
      )
    )
    .returning({ id: mockups.id })
  return { saved: savedRows.length > 0 }
}

export const updateRecordStatus = async (
  input: {
    id: string
    status: MockupStatus
    expectedRevision: number
  },
  userId: string
) => {
  const savedRows = await getDatabase()
    .update(mockups)
    .set({
      status: input.status,
      revision: sql`${mockups.revision} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mockups.id, input.id),
        inArray(
          mockups.organizationId,
          authorizedOrganizations(userId, "update")
        ),
        eq(mockups.revision, input.expectedRevision),
        isNull(mockups.deletedAt)
      )
    )
    .returning({ revision: mockups.revision })
  return { saved: savedRows.length > 0 }
}
