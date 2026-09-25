import { APIError } from "better-auth/api"
import { organization } from "better-auth/plugins"
import {
  isDigiteventUser,
  ACCOUNT_REQUIRED_MESSAGE,
} from "@/features/auth/policy"
import { accessControl, isTeamRole, roles } from "./permissions"
import { inviteMemberSchema, teamFormSchema } from "@/validators/teams"

export const organizationPlugin = () =>
  organization({
    ac: accessControl,
    roles,
    creatorRole: "owner",
    allowUserToCreateOrganization: (user) => isDigiteventUser(user),
    invitationExpiresIn: 60 * 60 * 24 * 7,
    requireEmailVerificationOnInvitation: true,
    organizationHooks: {
      beforeCreateOrganization: async ({ organization: team }) => {
        const result = teamFormSchema.safeParse(team)
        if (!result.success)
          throw new APIError("BAD_REQUEST", {
            message: result.error.issues[0].message,
          })
        return { data: { ...team, ...result.data } }
      },
      beforeUpdateOrganization: async ({ organization: team }) => {
        const result = teamFormSchema.partial().safeParse(team)
        if (!result.success)
          throw new APIError("BAD_REQUEST", {
            message: result.error.issues[0].message,
          })
        return { data: { ...team, ...result.data } }
      },
      beforeCreateInvitation: async ({ invitation }) => {
        const result = inviteMemberSchema.safeParse(invitation)
        if (!result.success)
          throw new APIError("BAD_REQUEST", {
            message: result.error.issues[0].message,
          })
        return { data: { ...invitation, ...result.data } }
      },
      beforeUpdateMemberRole: async ({ newRole }) => {
        if (!isTeamRole(newRole))
          throw new APIError("BAD_REQUEST", { message: "Rôle invalide." })
      },
      beforeAcceptInvitation: async ({ user }) => {
        if (!isDigiteventUser(user))
          throw new APIError("FORBIDDEN", { message: ACCOUNT_REQUIRED_MESSAGE })
      },
    },
  })
