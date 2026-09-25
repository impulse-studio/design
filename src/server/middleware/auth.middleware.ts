import { authorizeBrowserRequest } from "@/features/auth/browser-policy.server"
import { base } from "@/server/context"

export const authMiddleware = base.middleware(
  async ({ context, errors, next }) => {
    const { user } = await authorizeBrowserRequest(context.request, {
      session: "required",
    }).catch(() => ({ user: null }))
    if (!user) throw errors.UNAUTHORIZED()
    return next({ context: { user } })
  }
)
