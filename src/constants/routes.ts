export const APP_ROUTES = {
  studio: "/",
  login: "/login",
  teams: "/teams",
  designSystem: "/design-system",
  designSystemComponent: "/design-system/$slug",
  editor: "/m/$mockupId",
} as const

export const APP_ROUTE_PATTERNS = {
  editor: new RegExp(
    `^${APP_ROUTES.editor.replace("$mockupId", "[a-zA-Z0-9_-]+")}$`
  ),
  designSystem: new RegExp(
    `^${APP_ROUTES.designSystem}(?:/[a-zA-Z0-9_-]+)?$`
  ),
} as const
