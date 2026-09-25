import { and, eq, gt, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { invitation, member, organization, user } from "@/db/schema"

export const listTeamsForUser = (userId: string) =>
  getDatabase()
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))
    .orderBy(organization.name)

export const findActiveTeam = async (
  userId: string,
  activeId: string | null
) => {
  const teams = await listTeamsForUser(userId)
  return teams.find((team) => team.id === activeId) ?? teams.at(0) ?? null
}

export const getTeamOverview = async (currentUser: {
  id: string
  email: string
  activeOrganizationId: string | null
}) => {
  const db = getDatabase()
  const teams = await listTeamsForUser(currentUser.id)
  const activeTeam =
    teams.find((team) => team.id === currentUser.activeOrganizationId) ??
    teams.at(0) ??
    null
  const [members, invitations, receivedInvitations] = await Promise.all([
    activeTeam
      ? db
          .select({
            id: member.id,
            userId: member.userId,
            role: member.role,
            canManageLibraries: member.canManageLibraries,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(member)
          .innerJoin(user, eq(member.userId, user.id))
          .where(eq(member.organizationId, activeTeam.id))
          .orderBy(user.name)
      : [],
    activeTeam
      ? db
          .select({
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expiresAt: invitation.expiresAt,
          })
          .from(invitation)
          .where(
            and(
              eq(invitation.organizationId, activeTeam.id),
              eq(invitation.status, "pending"),
              gt(invitation.expiresAt, new Date())
            )
          )
      : [],
    db
      .select({
        id: invitation.id,
        organizationName: organization.name,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      })
      .from(invitation)
      .innerJoin(organization, eq(invitation.organizationId, organization.id))
      .where(
        and(
          sql`lower(${invitation.email}) = ${currentUser.email.toLowerCase()}`,
          eq(invitation.status, "pending"),
          gt(invitation.expiresAt, new Date())
        )
      ),
  ])
  return { teams, activeTeam, members, invitations, receivedInvitations }
}
