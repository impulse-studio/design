import { base } from "@/server/context"
import { getThemeHandler } from "@/server/routers/theme/queries/get"

export const themeRouter = base.router({
  get: getThemeHandler.route({ method: "GET" }),
})
