import { createMcpProjectSchema } from "@/validators/mcp/projects"

import { createRecord } from "@/features/mockups/repository.server"
import { createSite } from "@/features/sites/create.server"
import { listTeamsForUser } from "@/features/teams/repository.server"
import { isTeamRole, roles } from "@/features/teams/permissions"

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

  const site = await createSite({ name: input.name, organizationId: team.id })
  return {
    id: site.id,
    kind: input.kind,
    revision: site.revision,
    url: `${origin}/m/${site.id}`,
  }
}
