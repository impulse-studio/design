import { getAuth } from "@/features/auth/auth.server"
import { getAuthEnvironment } from "@/features/auth/config.server"
import { authorizeBrowserRequest } from "@/features/auth/browser-policy.server"
import { seedDevelopmentAccount } from "@/features/auth/development.server"
import { publicProcedure } from "@/server/procedure/public.procedure"

export const signInDevelopmentHandler = publicProcedure.handler(
  async ({ context, errors }) => {
    const environment = getAuthEnvironment()
    const allowedOrigin = await authorizeBrowserRequest(context.request, {
      session: "optional",
      mutation: true,
    }).then(
      () => true,
      () => false
    )
    if (!environment?.devMode || !allowedOrigin) {
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
