import { redirect } from "@tanstack/react-router"
import { APP_ROUTES } from "@/constants"
import { getLoginRedirect } from "@/features/auth/policy"
import type { CurrentUser } from "@/features/auth/session.server"

export const requireAuthenticatedUser = (
  user: CurrentUser | null,
  pathname: string
): void => {
  if (!user) {
    throw redirect({
      to: APP_ROUTES.login,
      search: { redirect: getLoginRedirect(pathname) },
    })
  }
}
