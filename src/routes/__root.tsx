import { createRootRouteWithContext } from "@tanstack/react-router"
import { RootDocument } from "@/components/shared/RootDocument"
import { NotFoundPage } from "@/pages/not-found/page"
import { DESIGN_SYSTEM_NAME, PROJECT_DESCRIPTION } from "@/constants"
import type { RouterContext } from "@/router"
import appCss from "@/styles.css?url"
import dialkitCss from "dialkit/styles.css?url"

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const [theme, user] = await Promise.all([
      context.queryClient.fetchQuery(context.orpc.theme.get.queryOptions()),
      context.queryClient.fetchQuery(
        context.orpc.auth.getCurrentUser.queryOptions()
      ),
    ])
    return { theme, user }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${DESIGN_SYSTEM_NAME} — Bibliothèque d’interface` },
      {
        name: "description",
        content: PROJECT_DESCRIPTION,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: dialkitCss }] : []),
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})
