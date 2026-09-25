import { createServerOnlyFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { getAuth } from "./auth.server"
import { getAuthEnvironment } from "./config.server"
import { isDigiteventUser } from "./policy"

export type CurrentUser = {
  id: string
  name: string
  email: string
  image: string | null
  activeOrganizationId: string | null
}

export const readCurrentUser = createServerOnlyFn(
  async (requestHeaders?: Headers): Promise<CurrentUser | null> => {
    if (!getAuthEnvironment()) return null
    const session = await getAuth().api.getSession({
      headers: requestHeaders ?? getRequestHeaders(),
    })
    if (!session || !isDigiteventUser(session.user)) return null
    const { id, name, email, image } = session.user
    // The session token and provider credentials never enter route data.
    return {
      id,
      name,
      email,
      image: image ?? null,
      activeOrganizationId: session.session.activeOrganizationId ?? null,
    }
  }
)
