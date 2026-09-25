import { APP_ROUTE_PATTERNS, APP_ROUTES } from "@/constants"

export const DIGITEVENT_DOMAIN = "digitevent.com"
export const ACCOUNT_REQUIRED = "DIGITEVENT_ACCOUNT_REQUIRED"
export const ACCOUNT_REQUIRED_MESSAGE =
  "Utilisez votre compte Google professionnel @digitevent.com."

export const isDigiteventUser = (user: {
  email?: string | null
  emailVerified?: boolean
}) =>
  user.emailVerified === true &&
  typeof user.email === "string" &&
  /^[^\s@]+@digitevent\.com$/i.test(user.email)

// Only known application routes may be used as post-login destinations.
export const getLoginRedirect = (value: unknown): string => {
  if (typeof value !== "string" || /[\\\s]/.test(value))
    return APP_ROUTES.studio
  if (value === APP_ROUTES.studio || value === APP_ROUTES.teams) return value
  if (APP_ROUTE_PATTERNS.editor.test(value)) return value
  if (APP_ROUTE_PATTERNS.designSystem.test(value)) return value
  return APP_ROUTES.studio
}

export const getLoginError = (error?: string): string | null => {
  if (!error) return null
  if (error === ACCOUNT_REQUIRED || error === "unable_to_get_user_info")
    return ACCOUNT_REQUIRED_MESSAGE
  if (error === "access_denied")
    return "La connexion a été annulée. Vous pouvez réessayer."
  return "La connexion n’a pas abouti. Réessayez avec votre compte Google Digitevent."
}
