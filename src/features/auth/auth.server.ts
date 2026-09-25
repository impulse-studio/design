import { createServerOnlyFn } from "@tanstack/react-start"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { jwt } from "better-auth/plugins"
import { mcp } from "@better-auth/mcp"
import { cimd } from "@better-auth/cimd"
import { fetchClientMetadataResource } from "@better-auth/cimd/node"
import { getDatabase } from "@/db/client.server"
import * as schema from "@/db/schema"
import { getAuthEnvironment } from "./config.server"
import { createAuthOptions } from "./options.server"
import { organizationPlugin } from "@/features/teams/plugin.server"

const createAuth = () => {
  const env = getAuthEnvironment()
  if (!env) throw new Error("Configuration Google / Better Auth incomplète.")
  return betterAuth({
    ...createAuthOptions(env),
    database: drizzleAdapter(getDatabase(), { provider: "pg", schema }),
    plugins: [
      organizationPlugin(),
      jwt(),
      mcp({
        loginPage: "/login",
        consentPage: "/consent",
        // Les clients sans CIMD, dont Codex, utilisent RFC 7591.
        // L’enregistrement du client ne donne aucun accès aux maquettes :
        // la connexion utilisateur, le consentement et PKCE restent requis.
        allowDynamicClientRegistration: true,
        allowUnauthenticatedClientRegistration: true,
        clientRegistrationRequirePKCE: true,
        resource: new URL("/api/mcp", env.BETTER_AUTH_URL).toString(),
        scopes: [
          "openid",
          "profile",
          "offline_access",
          "mcp:read",
          "mcp:write",
        ],
      }),
      cimd({
        fetchClientMetadataResource,
        metadataProfile: "mcp-2026-07-28",
      }),
      tanstackStartCookies(),
    ],
  })
}

let auth: ReturnType<typeof createAuth> | undefined
export const getAuth = createServerOnlyFn(() => (auth ??= createAuth()))

export const handleAuthRequest = createServerOnlyFn((request: Request) => {
  if (!getAuthEnvironment()) {
    return Response.json(
      {
        code: "AUTH_NOT_CONFIGURED",
        message: "La connexion est temporairement indisponible.",
      },
      { status: 503 }
    )
  }
  return getAuth().handler(request)
})
