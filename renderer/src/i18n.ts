import type { App } from "vue"

// Minimal $t for copied backoffice templates. Unknown keys are returned as-is, so mockups can pass plain French labels.
const messages: Record<string, string> = {
  BACK_TO_EVENTS: "Retour aux événements",
  MY_EVENTS: "Mes événements",
  EVENT_MENU_PREVIEW_FRONT_CTA: "Prévisualiser",
  EVENT_MENU_PRODUCT_CHANGES_CTA: "Nouveautés",
}

export function t(key: string): string {
  return messages[key] ?? key
}

export const i18nStub = {
  install(app: App) {
    app.config.globalProperties.$t = t
  },
}
