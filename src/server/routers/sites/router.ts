import { base } from "@/server/context"
import { changeSiteHandler } from "@/server/routers/sites/mutations/change"
import { createSiteHandler } from "@/server/routers/sites/mutations/create"
import { getSiteHandler } from "@/server/routers/sites/queries/get"
import { getSiteHistoryHandler } from "@/server/routers/sites/queries/get-history"
import { getSiteVersionHandler } from "@/server/routers/sites/queries/get-version"

import { scaffoldSiteHandler } from "./mutations/scaffold"

export const sitesRouter = base.router({
  get: getSiteHandler.route({ method: "GET" }),
  getHistory: getSiteHistoryHandler.route({ method: "GET" }),
  getVersion: getSiteVersionHandler.route({ method: "GET" }),
  scaffold: scaffoldSiteHandler.route({ method: "POST" }),
  create: createSiteHandler.route({ method: "POST" }),
  change: changeSiteHandler.route({ method: "POST" }),
})
