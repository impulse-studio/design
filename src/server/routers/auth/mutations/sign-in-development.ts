import { getAuth } from "@/features/auth/auth.server"
import { getAuthEnvironment } from "@/features/auth/config.server"
import { seedDevelopmentAccount } from "@/features/auth/development.server"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const signInDevelopmentHandler = publicProcedure.handler(
  async ({ context, errors }) => {
    const environment = getAuthEnvironment()
    if (
      !environment?.devMode ||
      context.request.headers.get("origin") !==
        new URL(environment.BETTER_AUTH_URL).origin
    ) {
      throw errors.FORBIDDEN({
        message: "Connexion de développement indisponible.",
      })
    }

    const credentials = await seedDevelopmentAccount()
    await getAuth().api.signInEmail({
      body: credentials,
      headers: context.headers,
    })
    return { success: true }
  }
)
