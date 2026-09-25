import { z } from "zod"
import { aiCatalog, validateAiComposition } from "@/features/ai/catalog"
import { applyOperations, operationSchema } from "@/features/ai/operations"
import { listTeamsForUser } from "@/features/teams/repository.server"
import {
  listRecords,
  loadRecord,
  saveRecord,
} from "@/features/mockups/repository.server"
import { library } from "@/features/editor/library"
import { walk } from "@digit-ai-studio/shared"

export const mockupReferenceSchema = z.string().min(1).max(500)
export const applyChangesSchema = z.object({
  mockup: mockupReferenceSchema,
  expectedRevision: z.number().int().nonnegative(),
  summary: z.string().trim().min(1).max(4000),
  operations: z.array(operationSchema).min(1).max(100),
})

export const resolveMockupId = (reference: string, origin: string) => {
  if (!reference.includes("://")) return z.string().uuid().parse(reference)
  const url = new URL(reference)
  if (url.origin !== origin || url.search || url.hash)
    throw new Error("Le lien doit désigner une maquette de ce studio.")
  const match = /^\/m\/([0-9a-f-]{36})$/.exec(url.pathname)
  if (!match) throw new Error("Lien de maquette invalide.")
  return z.string().uuid().parse(match[1])
}

export const listMcpMockups = async (userId: string) => {
  const teams = await listTeamsForUser(userId)
  const groups = await Promise.all(
    teams.map(async (team) => ({
      team: team.name,
      records: await listRecords(userId, team.id),
    }))
  )
  return groups.flatMap(({ team, records }) =>
    records.map((record) => ({ ...record, team }))
  )
}

export const readMcpMockup = async (
  userId: string,
  reference: string,
  origin: string,
  mode: "overview" | "full" = "full"
) => {
  const record = await loadRecord(resolveMockupId(reference, origin), userId)
  if (mode === "full") return record
  return {
    id: record.id,
    name: record.name,
    status: record.status,
    revision: record.revision,
    canEdit: record.canEdit,
    pages: record.doc.pages.map((page) => ({
      id: page.id,
      name: page.name,
      frames: page.frames.map((frame) => {
        let nodeCount = 0
        walk(frame, () => {
          nodeCount++
        })
        return {
          id: frame.id,
          name: frame.name,
          width: frame.width,
          height: frame.height,
          nodeCount,
        }
      }),
    })),
  }
}

export const searchMcpCatalog = (
  query?: string,
  limit = 20,
  includeExamples = false
) =>
  aiCatalog
    .filter((entry) =>
      entry.name.toLowerCase().includes(query?.toLowerCase() ?? "")
    )
    .slice(0, limit)
    .map((entry) =>
      includeExamples
        ? entry
        : { name: entry.name, props: entry.props, slots: entry.slots }
    )

export const applyMcpChanges = async (
  userId: string,
  raw: unknown,
  origin: string
) => {
  const input = applyChangesSchema.parse(raw)
  const record = await loadRecord(resolveMockupId(input.mockup, origin), userId)
  if (!record.canEdit) throw new Error("Cette maquette est en lecture seule.")
  if (record.revision !== input.expectedRevision)
    return { status: "conflict" as const, revision: record.revision }
  const doc = validateAiComposition(
    record.doc,
    applyOperations(
      record.doc,
      { summary: input.summary, operations: input.operations },
      library
    )
  )
  return saveRecord(
    {
      id: record.id,
      expectedRevision: input.expectedRevision,
      name: record.name,
      status: record.status,
      doc,
    },
    userId
  )
}
