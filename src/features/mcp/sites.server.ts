import {
  applySiteChangesSchema,
  readSiteOptionsSchema,
} from "@/validators/mcp/sites"
import type { z } from "zod"
import { inArray } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { siteProjects } from "@/db/schema"
import { loadSite, saveSiteChange } from "@/features/sites/repository.server"
import { applySiteProposal } from "@/features/sites/source"

import { siteInstructions } from "@/features/sites/instructions"
import { listMcpMockups, resolveMockupId } from "./mockups.server"

export const listMcpSites = async (userId: string, origin: string) => {
  const records = await listMcpMockups(userId)
  if (records.length === 0) return []
  const projects = await getDatabase()
    .select({ id: siteProjects.id, revision: siteProjects.revision })
    .from(siteProjects)
    .where(
      inArray(
        siteProjects.id,
        records.map((record) => record.id)
      )
    )
  const byId = new Map(projects.map((project) => [project.id, project]))
  return records.flatMap((record) => {
    const project = byId.get(record.id)
    return project
      ? [
          {
            ...record,
            revision: project.revision,
            url: `${origin}/m/${record.id}`,
            kind: "react-vite" as const,
          },
        ]
      : []
  })
}

export const readMcpSite = async (
  userId: string,
  reference: string,
  origin: string,
  options: z.input<typeof readSiteOptionsSchema> = {}
) => {
  const { mode, paths } = readSiteOptionsSchema.parse(options)
  const { record, project } = await loadSite(
    resolveMockupId(reference, origin),
    userId
  )
  if (!project)
    throw new Error(
      "Cette maquette n’est pas un site React. Utilisez read_mockup."
    )
  const files = project.doc.files
  if (paths) {
    const missing = paths.filter((path) => !(path in files))
    if (missing.length)
      throw new Error(`Fichiers introuvables : ${missing.join(", ")}`)
  }
  return {
    id: project.id,
    name: record.name,
    canEdit: record.canEdit,
    revision: project.revision,
    doc:
      mode === "overview"
        ? {
            kind: project.doc.kind,
            routes: project.doc.routes,
            dependencies: project.doc.dependencies,
            files: Object.fromEntries(
              Object.entries(files).map(([path, content]) => [
                path,
                content.length,
              ])
            ),
            assetPaths: Object.keys(project.doc.assets),
          }
        : paths
          ? {
              ...project.doc,
              files: Object.fromEntries(
                paths.map((path) => [path, files[path]])
              ),
              assets: {},
            }
          : project.doc,
    instructions: siteInstructions.replace(
      "Utilise propose_site_changes pour une proposition complète : writeFile remplace un fichier avec son contenu complet, replaceInFile remplace une occurrence exacte pour les petites itérations, deleteFile supprime un fichier. Ne prétends pas que la modification est déjà appliquée : le Studio compile puis applique automatiquement sur la révision d'origine, avec historique.",
      "Utilise apply_site_changes avec la révision lue : writeFile remplace un fichier complet, replaceInFile remplace une occurrence exacte pour les petites itérations, deleteFile supprime un fichier. Le serveur valide la structure et enregistre les changements avec historique ; la compilation aura lieu dans le navigateur à la prochaine ouverture. En cas de conflit, relis le site avant de réessayer."
    ),
  }
}

export const applyMcpSiteChanges = async (
  userId: string,
  raw: unknown,
  origin: string
) => {
  const { site, expectedRevision, ...proposal } =
    applySiteChangesSchema.parse(raw)
  const { record, project } = await loadSite(
    resolveMockupId(site, origin),
    userId
  )
  if (!project) throw new Error("Ce projet n’est pas un site React.")
  if (!record.canEdit) throw new Error("Projet en lecture seule.")
  if (project.revision !== expectedRevision)
    return { status: "conflict" as const, revision: project.revision }
  applySiteProposal(project.doc, proposal)
  const saved = await saveSiteChange(record.id, userId, expectedRevision, {
    type: "mcp",
    input: proposal,
  })
  return {
    status: "saved" as const,
    id: saved.id,
    revision: saved.revision,
    url: `${origin}/m/${saved.id}`,
  }
}
