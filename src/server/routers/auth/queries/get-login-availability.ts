import { getAuthEnvironment } from "@/features/auth/config.server"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const getLoginAvailabilityHandler = publicProcedure.handler(() => {
  const environment = getAuthEnvironment()
  return {
    configured: environment !== null,
    devMode: environment?.devMode ?? false,
  }
})
