import { librariesRouter } from "@/server/routers/libraries/router"
import { base } from "@/server/context"
import { authRouter } from "@/server/routers/auth/router"
import { mcpRouter } from "@/server/routers/mcp/router"
import { mockupsRouter } from "@/server/routers/mockups/router"
import { sitesRouter } from "@/server/routers/sites/router"
import { teamsRouter } from "@/server/routers/teams/router"
import { themeRouter } from "@/server/routers/theme/router"

export const appRouter = base.router({
  libraries: librariesRouter,
  auth: authRouter,
  mcp: mcpRouter,
  mockups: mockupsRouter,
  sites: sitesRouter,
  teams: teamsRouter,
  theme: themeRouter,
})

export type AppRouter = typeof appRouter
