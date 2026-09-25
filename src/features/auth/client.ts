import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { oauthProviderClient } from "@better-auth/oauth-provider/client"
import { accessControl, roles } from "@/features/teams/permissions"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({ ac: accessControl, roles }),
    oauthProviderClient(),
  ],
})
