import { v4 as uuid } from "uuid"
import type { Transaction } from "@/db/types"

import { eq, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { mockups, siteProjects, siteVersions } from "@/db/schema"
import { loadRecord } from "@/features/mockups/repository.server"
import { SiteFailure } from "./errors"
import { normalizeSources } from "./source"
import { siteDocumentSchema } from "@/validators/sites/document"
import type { SiteDocument } from "@/validators/sites/document"
import type { SiteProjectRow } from "@/db/schema/sites"

type SiteVersionTransaction = Transaction

type SiteVersionDraft = {
  doc: SiteDocument
  summary: string
}

export const initializeSiteVersion = async (
  tx: SiteVersionTransaction,
  id: string,
  candidate: SiteDocument
) => {
  const parsed = siteDocumentSchema.safeParse(candidate)
  if (!parsed.success)
    throw new SiteFailure("invalid", "Le document initial est invalide.")
  const doc = normalizeSources(parsed.data)
  await tx.insert(siteProjects).values({ id, doc })
  await tx.insert(siteVersions).values({
    id: uuid(),
    projectId: id,
    revision: 0,
    doc,
    summary: "Création du site",
  })
  return doc
}

type CommitSiteVersionInput = {
  id: string
  userId: string
  expectedRevision: number
  prepare: (
    tx: SiteVersionTransaction,
    current: SiteProjectRow
  ) => Promise<SiteVersionDraft> | SiteVersionDraft
}

const authorizeWrite = async (id: string, userId: string) => {
  let record
  try {
    record = await loadRecord(id, userId)
  } catch {
    throw new SiteFailure("not_found", "Projet introuvable.")
  }
  if (!record.canEdit)
    throw new SiteFailure("forbidden", "Projet en lecture seule.")
}

export const commitSiteVersion = async ({
  id,
  userId,
  expectedRevision,
  prepare,
}: CommitSiteVersionInput): Promise<SiteProjectRow> => {
  await authorizeWrite(id, userId)
  return getDatabase().transaction(async (tx) => {
    const row = await tx
      .select()
      .from(siteProjects)
      .where(eq(siteProjects.id, id))
      .for("update")
      .then((rows) => rows.at(0))
    if (!row) throw new SiteFailure("not_found", "Projet introuvable.")
    if (row.revision !== expectedRevision)
      throw new SiteFailure(
        "conflict",
        "Le projet a changé. Rechargez avant de poursuivre ; vos valeurs restent dans le panneau."
      )

    const parsedCurrent = siteDocumentSchema.safeParse(row.doc)
    if (!parsedCurrent.success)
      throw new SiteFailure("invalid", "Le document enregistré est invalide.")
    const current: SiteProjectRow = {
      id,
      revision: row.revision,
      doc: normalizeSources(parsedCurrent.data),
    }
    let draft: SiteVersionDraft
    try {
      draft = await prepare(tx, current)
    } catch (error) {
      if (error instanceof SiteFailure) throw error
      throw new SiteFailure(
        "invalid",
        error instanceof Error ? error.message : "Modification invalide."
      )
    }
    const parsed = siteDocumentSchema.safeParse(draft.doc)
    if (!parsed.success)
      throw new SiteFailure("invalid", "Le document produit est invalide.")

    const doc = normalizeSources(parsed.data)
    const revision = current.revision + 1
    await tx
      .update(siteProjects)
      .set({ doc, revision })
      .where(eq(siteProjects.id, id))
    await tx.insert(siteVersions).values({
      id: uuid(),
      projectId: id,
      revision,
      doc,
      summary: draft.summary,
    })
    await tx
      .update(mockups)
      .set({ updatedAt: new Date(), revision: sql`${mockups.revision}+1` })
      .where(eq(mockups.id, id))
    return { id, doc, revision }
  })
}
