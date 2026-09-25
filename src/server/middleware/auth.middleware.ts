import { readCurrentUser } from "@/features/auth/session.server"
import { base } from "@/server/context"

export const authMiddleware = base.middleware(
  async ({ context, errors, next }) => {
    const user = await readCurrentUser(context.headers)
    if (!user) throw errors.UNAUTHORIZED()
    return next({ context: { user } })
  }
)
