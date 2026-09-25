import { getCookie } from "@tanstack/react-start/server"
import { THEME_COOKIE, parseTheme } from "@/features/theme/theme"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const getThemeHandler = publicProcedure.handler(() =>
  parseTheme(getCookie(THEME_COOKIE))
)
