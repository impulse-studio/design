import { base } from "@/server/context"
import { createMockupHandler } from "@/server/routers/mockups/mutations/create"
import { saveMockupHandler } from "@/server/routers/mockups/mutations/save"
import { setMockupStatusHandler } from "@/server/routers/mockups/mutations/set-status"
import { updateMockupLinksHandler } from "@/server/routers/mockups/mutations/update-links"
import { getMockupHandler } from "@/server/routers/mockups/queries/get"
import { getMockupRevisionHandler } from "@/server/routers/mockups/queries/get-revision"
import { listMockupsHandler } from "@/server/routers/mockups/queries/list"

export const mockupsRouter = base.router({
  list: listMockupsHandler.route({ method: "GET" }),
  get: getMockupHandler.route({ method: "GET" }),
  getRevision: getMockupRevisionHandler.route({ method: "GET" }),
  create: createMockupHandler.route({ method: "POST" }),
  save: saveMockupHandler.route({ method: "POST" }),
  setStatus: setMockupStatusHandler.route({ method: "POST" }),
  updateLinks: updateMockupLinksHandler.route({ method: "POST" }),
})
