import { randomUUID } from "node:crypto"
import { z } from "zod"
import { getDatabase } from "@/db/client.server"
import { mockups, siteProjects, siteVersions } from "@/db/schema"
import { emptyDocument } from "@/features/editor/document"
import { createRecord } from "@/features/mockups/repository.server"
import { createSiteDocument } from "@/features/sites/template"
import { listTeamsForUser } from "@/features/teams/repository.server"
import { isTeamRole, roles } from "@/features/teams/permissions"

export const createMcpProjectSchema = z.object({
  name: z.string().trim().min(1).max(200),
  kind: z.enum(["site", "mockup"]),
  teamId: z.string().optional(),
})

export const createMcpProject = async (
  userId: string,
  raw: unknown,
  origin: string
) => {
  const input = createMcpProjectSchema.parse(raw)
  const teams = (await listTeamsForUser(userId)).filter(
    (team) =>
      isTeamRole(team.role) &&
      roles[team.role].authorize({ mockup: ["create"] }).success
  )
  const team = input.teamId
    ? teams.find((candidate) => candidate.id === input.teamId)
    : teams.length === 1
      ? teams[0]
      : null
  if (!team) {
    if (teams.length > 1 && !input.teamId)
      throw new Error(
        `Précisez teamId : ${teams.map(({ id, name }) => `${name} (${id})`).join(", ")}`
      )
    throw new Error("Création non autorisée dans cette équipe.")
  }

  if (input.kind === "mockup") {
    const record = await createRecord(input.name, userId, team.id)
    return {
      id: record.id,
      kind: input.kind,
      revision: record.revision,
      url: `${origin}/m/${record.id}`,
    }
  }

  const id = randomUUID()
  const doc = createSiteDocument()
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
  return { id, kind: input.kind, revision: 0, url: `${origin}/m/${id}` }
}
