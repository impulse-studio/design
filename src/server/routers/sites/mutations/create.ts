import { siteKindSchema } from "@/features/sites/schema"
import { randomUUID } from "node:crypto"
import { getDatabase } from "@/db/client.server"
import { mockups, siteProjects, siteVersions } from "@/db/schema"
import { emptyDocument } from "@/features/editor/document"
import { findActiveTeam } from "@/features/teams/repository.server"
import { isTeamRole, roles } from "@/features/teams/permissions"
import { createSiteDocument } from "@/features/sites/template"
import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { z } from "zod"

export const createSiteHandler = protectedProcedure
  .input(z.object({ name: z.string().trim().min(1).max(200), kind: siteKindSchema.default("react-vite") }))
  .handler(async ({ context, errors, input }) => {
    const team = await findActiveTeam(
      context.user.id,
      context.user.activeOrganizationId
    )
    if (
      !team ||
      !isTeamRole(team.role) ||
      !roles[team.role].authorize({ mockup: ["create"] }).success
    ) {
      throw errors.FORBIDDEN({ message: "Création non autorisée." })
    }

    const id = randomUUID()
    const doc = createSiteDocument(input.kind)
    try {
      await getDatabase().transaction(async (tx) => {
        await tx.insert(mockups).values({
          id,
          name: input.name,
          organizationId: team.id,
          doc: emptyDocument(),
        })
        await tx.insert(siteProjects).values({ id, doc })
        await tx.insert(siteVersions).values({
          id: randomUUID(),
          projectId: id,
          revision: 0,
          doc,
          summary: "Création du site",
        })
      })
    } catch {
      throw errors.CONFLICT({
        message:
          "Le site n’a pas pu être créé. Vérifiez les migrations de la base de données du Studio.",
      })
    }
    return { id }
  })
