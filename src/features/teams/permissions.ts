import { createAccessControl } from "better-auth/plugins/access"
import { teamRoleSchema } from "@/validators/teams"
import type { z } from "zod"
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access"

export const accessControl = createAccessControl({
  ...defaultStatements,
  mockup: ["read", "create", "update"],
} as const)

export const roles = {
  owner: accessControl.newRole({
    ...ownerAc.statements,
    mockup: ["read", "create", "update"],
  }),
  admin: accessControl.newRole({
    ...adminAc.statements,
    mockup: ["read", "create", "update"],
  }),
  member: accessControl.newRole({
    ...memberAc.statements,
    mockup: ["read", "create", "update"],
  }),
  viewer: accessControl.newRole({ mockup: ["read"] }),
}

export type TeamRole = z.infer<typeof teamRoleSchema>
export const roleLabels: Record<TeamRole, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  member: "Éditeur",
  viewer: "Lecteur",
}
export const roleDescriptions: Record<TeamRole, string> = {
  owner: "Tous les droits, y compris nommer des propriétaires.",
  admin: "Gérer l’équipe, les membres et les maquettes.",
  member: "Créer et modifier les maquettes de l’équipe.",
  viewer: "Consulter les maquettes et inspecter les composants.",
}
export const isTeamRole = (role: string): role is TeamRole =>
  teamRoleSchema.safeParse(role).success
export const canEditMockups = (role: string) =>
  isTeamRole(role) && roles[role].authorize({ mockup: ["update"] }).success
export const canManageMembers = (role: string) =>
  isTeamRole(role) && roles[role].authorize({ member: ["update"] }).success
