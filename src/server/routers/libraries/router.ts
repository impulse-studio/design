import { base } from "@/server/context"
import { listLibraryHandler } from "./queries/list"
import { publishLibraryHandler } from "./mutations/publish"
import { compareLibraryHandler } from "./queries/compare"
import { installLibraryHandler } from "./mutations/install"
import { connectLibraryHandler } from "./mutations/connect"
import { disconnectLibraryHandler } from "./mutations/disconnect"
import { permissionLibraryHandler } from "./mutations/permission"

export const librariesRouter = base.router({
  list: listLibraryHandler.route({ method: "GET" }),
  publish: publishLibraryHandler.route({ method: "POST" }),
  compare: compareLibraryHandler.route({ method: "GET" }),
  install: installLibraryHandler.route({ method: "POST" }),
  connect: connectLibraryHandler.route({ method: "POST" }),
  disconnect: disconnectLibraryHandler.route({ method: "POST" }),
  permission: permissionLibraryHandler.route({ method: "POST" }),
})
