import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { getRequest, setResponseStatus } from "@tanstack/react-start/server"
import { getAuthEnvironment } from "./config.server"
import { readCurrentUser } from "./session.server"
import { APP_ROUTES } from "@/constants"

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const user = await readCurrentUser()
    if (!user) throw redirect({ to: APP_ROUTES.login })
    const request = getRequest()
    if (request.method !== "GET" && request.method !== "HEAD") {
      const env = getAuthEnvironment()
      if (
        !env ||
        request.headers.get("origin") !== new URL(env.BETTER_AUTH_URL).origin
      ) {
        setResponseStatus(403)
        throw new Error("Origine de la requête non autorisée.")
      }
    }
    return next({ context: { user } })
  }
)
