import { validateSiteBuild } from "./compile.server"
import { randomUUID } from "node:crypto"
import { and, desc, eq, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import {
  aiRuns,
  mockups,
  siteProjects,
  siteVersions,
  siteProposals,
} from "@/db/schema"
import { loadRecord } from "@/features/mockups/repository.server"
import {
  applySiteProposal,
  applyTextEdit,
  applyVisualEdit,
  normalizeSources,
} from "./source"
import { siteDocumentSchema, siteProposalSchema } from "./schema"
import type { SiteChange, SiteDocument, SiteProposal } from "./schema"

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
  if (!row) throw new Error("Version introuvable.")
  return normalizeSources(siteDocumentSchema.parse(row.doc))
}
export const getSiteProposals = async (id: string, userId: string) => {
  await loadRecord(id, userId)
  return getDatabase()
    .select({
      id: siteProposals.id,
      input: siteProposals.input,
      status: siteProposals.status,
      baseRevision: siteProposals.baseRevision,
    })
    .from(siteProposals)
    .innerJoin(aiRuns, eq(aiRuns.id, siteProposals.runId))
    .where(
      and(
        eq(siteProposals.projectId, id),
        eq(aiRuns.userId, userId),
        eq(siteProposals.status, "pending")
      )
    )
    .limit(20)
}
export const persistSiteProposal = async (
  run: typeof aiRuns.$inferSelect,
  callId: string,
  args: unknown
) => {
  if (!run.context.project || !run.context.projectId)
    throw new Error("Projet absent.")
  const input = siteProposalSchema.parse(args)
  applySiteProposal(run.context.project, input)
  await getDatabase()
    .insert(siteProposals)
    .values({
      id: randomUUID(),
      projectId: run.context.projectId,
      runId: run.id,
      toolCallId: callId,
      baseRevision: run.context.revision,
      input,
    })
    .onConflictDoNothing()
  return {
    status: "pending",
    message:
      "Fichiers préparés. Le Studio compile puis applique automatiquement si la révision est toujours actuelle.",
  }
}
export const saveSiteChange = async (
  id: string,
  userId: string,
  expectedRevision: number,
  change: SiteChange | { type: "mcp"; input: SiteProposal }
) => {
  const record = await loadRecord(id, userId)
  if (!record.canEdit) throw new Error("Projet en lecture seule.")
  return getDatabase().transaction(async (tx) => {
    const current = await tx
      .select()
      .from(siteProjects)
      .where(eq(siteProjects.id, id))
      .for("update")
      .then((rows) => rows.at(0))
    if (!current) throw new Error("Projet introuvable.")
    if (current.revision !== expectedRevision)
      throw new Error(
        "Le projet a changé. Rechargez avant de poursuivre ; vos valeurs restent dans le panneau."
      )
    current.doc = normalizeSources(current.doc)
    let doc: SiteDocument, summary: string
    if (change.type === "file") {
      doc = applySiteProposal(current.doc, {summary:"Modification du fichier",operations:[{type:"writeFile",path:change.path,content:change.content}]})
      summary = `Modification de ${change.path}`
      await validateSiteBuild(doc)
    } else if (change.type === "mcp") {
      doc = applySiteProposal(current.doc, change.input)
      summary = change.input.summary
    } else if (change.type === "visual") {
      doc = applyVisualEdit(current.doc, change.edit)
      summary = "Ajustement visuel"
    } else if (change.type === "text") {
      doc = applyTextEdit(current.doc, change.id, change.text)
      summary = "Modification du texte"
    } else if (change.type === "restore") {
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
      if (!version) throw new Error("Version introuvable.")
      doc = normalizeSources(siteDocumentSchema.parse(version.doc))
      summary = `Restauration de la version ${version.revision}`
    } else {
      const proposal = await tx
        .select({
          proposal: siteProposals,
          userId: aiRuns.userId,
          status: aiRuns.status,
        })
        .from(siteProposals)
        .innerJoin(aiRuns, eq(aiRuns.id, siteProposals.runId))
        .where(
          and(
            eq(siteProposals.id, change.proposalId),
            eq(siteProposals.projectId, id)
          )
        )
        .then((rows) => rows.at(0))
      if (
        !proposal ||
        proposal.userId !== userId ||
        proposal.proposal.status !== "pending" ||
        proposal.proposal.baseRevision !== expectedRevision ||
        ["interrupted", "failed"].includes(proposal.status)
      )
        throw new Error(
          "Cette génération est obsolète. Demandez une nouvelle modification."
        )
      doc = applySiteProposal(current.doc, proposal.proposal.input)
      summary = proposal.proposal.input.summary
      await tx
        .update(siteProposals)
        .set({ status: "applied" })
        .where(eq(siteProposals.id, change.proposalId))
    }
    const revision = current.revision + 1
    await tx
      .update(siteProjects)
      .set({ doc, revision })
      .where(eq(siteProjects.id, id))
    await tx
      .insert(siteVersions)
      .values({ id: randomUUID(), projectId: id, revision, doc, summary })
    await tx
      .update(mockups)
      .set({ updatedAt: new Date(), revision: sql`${mockups.revision}+1` })
      .where(eq(mockups.id, id))
    return { id, doc, revision }
  })
}
