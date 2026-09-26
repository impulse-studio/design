import { and, desc, eq } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { siteProjects, siteVersions } from "@/db/schema"
import { loadRecord } from "@/features/mockups/repository.server"
import {
  applySiteProposal,
  applyTextEdit,
  applyVisualEdit,
  normalizeSources,
} from "./source"
import { SiteFailure } from "./errors"
import { siteDocumentSchema } from "@/validators/sites/document"
import type {
  SiteChange,
  SiteDocument,
  SiteProposal,
} from "@/validators/sites/document"
import { commitSiteVersion } from "./versioning.server"

export const findSite = async (id: string) =>
  getDatabase()
    .select()
    .from(siteProjects)
    .where(eq(siteProjects.id, id))
    .then((rows) => {
      const row = rows.at(0)
      return row ? { ...row, doc: normalizeSources(row.doc) } : null
    })
export const loadSite = async (id: string, userId: string) => {
  const record = await loadRecord(id, userId)
  const project = await findSite(id)
  return { record, project }
}
export const siteHistory = async (id: string, userId: string) => {
  await loadRecord(id, userId)
  return getDatabase()
    .select({
      id: siteVersions.id,
      revision: siteVersions.revision,
      summary: siteVersions.summary,
      createdAt: siteVersions.createdAt,
    })
    .from(siteVersions)
    .where(eq(siteVersions.projectId, id))
    .orderBy(desc(siteVersions.revision))
    .limit(100)
    .then((rows) =>
      rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))
    )
}
export const getSiteVersion = async (
  id: string,
  userId: string,
  versionId: string
) => {
  await loadRecord(id, userId)
  const row = await getDatabase()
    .select()
    .from(siteVersions)
    .where(and(eq(siteVersions.projectId, id), eq(siteVersions.id, versionId)))
    .then((rows) => rows.at(0))
  if (!row) throw new SiteFailure("not_found", "Version introuvable.")
  const doc = siteDocumentSchema.safeParse(row.doc)
  if (!doc.success)
    throw new SiteFailure("invalid", "La version enregistrée est invalide.")
  return normalizeSources(doc.data)
}
export const saveSiteChange = async (
  id: string,
  userId: string,
  expectedRevision: number,
  change: SiteChange | { type: "mcp"; input: SiteProposal }
) => {
  return commitSiteVersion({
    id,
    userId,
    expectedRevision,
    prepare: async (tx, current) => {
      let doc: SiteDocument, summary: string
      if (change.type === "file") {
        doc = applySiteProposal(current.doc, {
          summary: "Modification du fichier",
          operations: [
            { type: "writeFile", path: change.path, content: change.content },
          ],
        })
        summary = `Modification de ${change.path}`
      } else if (change.type === "mcp") {
        doc = applySiteProposal(current.doc, change.input)
        summary = change.input.summary
      } else if (change.type === "visual") {
        doc = applyVisualEdit(current.doc, change.edit)
        summary = "Ajustement visuel"
      } else if (change.type === "text") {
        doc = applyTextEdit(current.doc, change.id, change.text)
        summary = "Modification du texte"
      } else {
        const version = await tx
          .select()
          .from(siteVersions)
          .where(
            and(
              eq(siteVersions.id, change.versionId),
              eq(siteVersions.projectId, id)
            )
          )
          .then((rows) => rows.at(0))
        if (!version) throw new SiteFailure("invalid", "Version introuvable.")
        doc = normalizeSources(siteDocumentSchema.parse(version.doc))
        summary = `Restauration de la version ${version.revision}`
      }
      return { doc, summary }
    },
  })
}
