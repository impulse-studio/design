import { getAuthEnvironment } from "./config.server"
import { readCurrentUser } from "./session.server"
import type { CurrentUser } from "./session.server"

export class BrowserPolicyError extends Error {
  constructor(
    readonly kind: "origin" | "unauthorized",
    message: string
  ) {
    super(message)
  }
}

export const authorizeBrowserRequest = async (
  request: Request,
  policy: { session: "required" | "optional"; mutation?: boolean }
): Promise<{ user: CurrentUser | null }> => {
  const mutation =
    policy.mutation ?? !["GET", "HEAD", "OPTIONS"].includes(request.method)
  if (mutation) {
    const environment = getAuthEnvironment()
    const origin = request.headers.get("origin")
    if (
      !environment ||
      !origin ||
      origin !== new URL(environment.BETTER_AUTH_URL).origin
    )
      throw new BrowserPolicyError(
        "origin",
        "Origine de la requête non autorisée."
      )
  }

  const user = await readCurrentUser(request.headers)
  if (policy.session === "required" && !user)
    throw new BrowserPolicyError("unauthorized", "Connexion au studio requise.")
  return { user }
}
