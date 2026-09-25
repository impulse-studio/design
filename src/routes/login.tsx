import { createFileRoute, redirect } from "@tanstack/react-router"
import { getLoginRedirect } from "@/features/auth/policy"
import { LoginPage } from "@/pages/login/LoginPage"
import { PROJECT_NAME } from "@/constants"

export const Route = createFileRoute("/login")({
  validateSearch: (
    search: Record<string, unknown>
  ): { redirect?: string; error?: string } => ({
    redirect: getLoginRedirect(search.redirect),
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.user)
      throw redirect({ href: getLoginRedirect(search.redirect) })
  },
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      context.orpc.auth.getLoginAvailability.queryOptions()
    ),
  component: LoginPage,
  head: () => ({ meta: [{ title: `Connexion — ${PROJECT_NAME}` }] }),
})
