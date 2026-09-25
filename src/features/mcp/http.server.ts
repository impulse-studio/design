import {
  listSitesSchema,
  readSiteSchema,
  listMockupsSchema,
  readMockupSchema,
  searchComponentsSchema,
} from "@/validators/mcp/tools"
import { McpServer, createMcpHandler } from "@modelcontextprotocol/server"
import { requireMcpAuth } from "@better-auth/mcp"
import { getAuth } from "@/features/auth/auth.server"
import {
  applyMcpChanges,
  listMcpMockups,
  readMcpMockup,
  searchMcpCatalog,
} from "./mockups.server"
import { applyChangesSchema } from "@/validators/mcp/mockups"

import { getAuthEnvironment } from "@/features/auth/config.server"
import { hasCurrentMcpAccess } from "./connections.server"
import { createMcpProject } from "./create.server"
import { createMcpProjectSchema } from "@/validators/mcp/projects"
import { applyMcpSiteChanges, listMcpSites, readMcpSite } from "./sites.server"
import { applySiteChangesSchema } from "@/validators/mcp/sites"

const result = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value) }],
})

export const handleMcpPost = (request: Request) => {
  const origin = new URL(getAuthEnvironment()!.BETTER_AUTH_URL).origin
  return requireMcpAuth(
    getAuth(),
    async (authorizedRequest, claims) => {
      const userId = claims.sub
      if (!userId) return new Response("Invalid subject", { status: 401 })
      const clientId = typeof claims.azp === "string" ? claims.azp : null
      if (!clientId) return new Response("Client inconnu", { status: 403 })
      const scopes = new Set(String(claims.scope ?? "").split(" "))
      const granted = [...scopes].filter((scope) => scope.startsWith("mcp:"))
      if (!(await hasCurrentMcpAccess(userId, clientId, granted)))
        return new Response("Accès révoqué", { status: 403 })
      const handler = createMcpHandler(
        () => {
          const server = new McpServer({
            name: "digit-ai-studio",
            version: "1.0.0",
          })
          server.registerTool(
            "create_project",
            {
              description:
                "Crée un projet dans le Studio. kind=site pour un vrai site React/TypeScript à construire et itérer ; kind=mockup pour une maquette à base de composants Digi. Renvoie son lien et sa révision. Si plusieurs équipes sont disponibles, fournir teamId.",
              inputSchema: createMcpProjectSchema,
            },
            async (input) => {
              if (!scopes.has("mcp:write"))
                return {
                  ...result({ error: "Autorisation d'écriture MCP requise." }),
                  isError: true,
                }
              return result(await createMcpProject(userId, input, origin))
            }
          )
          server.registerTool(
            "list_sites",
            {
              description:
                "Liste les sites React modifiables dans le Studio, avec leur lien et leur révision. Utiliser ces outils pour la partie Site.",
              inputSchema: listSitesSchema,
              annotations: { readOnlyHint: true },
            },
            async () => result(await listMcpSites(userId, origin))
          )
          server.registerTool(
            "read_site",
            {
              description:
                "Lit un site React à partir de son lien /m/… ou de son identifiant. mode=overview donne rapidement routes, dépendances et liste des fichiers avec leurs tailles ; mode=full lit le contenu, éventuellement limité aux paths demandés. Toujours utiliser la révision retournée avant une modification.",
              inputSchema: readSiteSchema,
              annotations: { readOnlyHint: true },
            },
            async ({ site, mode, paths }) =>
              result(await readMcpSite(userId, site, origin, { mode, paths }))
          )
          server.registerTool(
            "apply_site_changes",
            {
              description:
                "Modifie un site React : writeFile crée ou remplace un fichier, replaceInFile change une occurrence exacte sans renvoyer le fichier entier, deleteFile supprime. Fournir expectedRevision obtenu par read_site et un résumé. Compilation avant sauvegarde, historique restaurable et actualisation automatique de l’aperçu. Relire en cas de conflit. Les fichiers du socle sont protégés.",
              inputSchema: applySiteChangesSchema,
            },
            async (input) => {
              if (!scopes.has("mcp:write"))
                return {
                  ...result({ error: "Autorisation d'écriture MCP requise." }),
                  isError: true,
                }
              return result(await applyMcpSiteChanges(userId, input, origin))
            }
          )
          server.registerTool(
            "list_mockups",
            {
              description:
                "Liste les maquettes accessibles et leurs révisions.",
              inputSchema: listMockupsSchema,
              annotations: { readOnlyHint: true },
            },
            async () => result(await listMcpMockups(userId))
          )
          server.registerTool(
            "read_mockup",
            {
              description:
                "Lit une maquette et sa révision. mode=overview renvoie seulement les pages, frames et nombres de nœuds ; mode=full renvoie l'arbre complet nécessaire pour modifier la maquette.",
              inputSchema: readMockupSchema,
              annotations: { readOnlyHint: true },
            },
            async ({ mockup, mode }) =>
              result(await readMcpMockup(userId, mockup, origin, mode))
          )
          server.registerTool(
            "search_components",
            {
              description:
                "Recherche les composants Digi par nom. Renvoie 20 résultats compacts par défaut ; includeExamples=true ajoute les exemples de nœuds nécessaires pour composer une maquette.",
              inputSchema: searchComponentsSchema,
              annotations: { readOnlyHint: true },
            },
            async ({ query, limit, includeExamples }) =>
              result(searchMcpCatalog(query, limit, includeExamples))
          )
          server.registerTool(
            "apply_mockup_changes",
            {
              description:
                "Applique directement des opérations à une maquette. Fournir sa révision lue au préalable ; en cas de conflit, relire la maquette. Les changements sont validés et enregistrés atomiquement.",
              inputSchema: applyChangesSchema,
            },
            async (input) => {
              if (!scopes.has("mcp:write"))
                return {
                  ...result({ error: "Autorisation d'écriture MCP requise." }),
                  isError: true,
                }
              return result(await applyMcpChanges(userId, input, origin))
            }
          )
          return server
        },
        // Codex still negotiates 2025-era Streamable HTTP. The SDK serves
        // those requests statelessly, behind the same OAuth and consent checks.
        { legacy: "stateless" }
      )
      return handler.fetch(authorizedRequest)
    },
    {
      resource: `${origin}/api/mcp`,
      requiredScopes: ["mcp:read"],
      challengeScopes: ["mcp:read", "mcp:write", "offline_access"],
    }
  )(request)
}
