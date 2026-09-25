import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { BatchLinkPlugin, DedupeRequestsPlugin } from "@orpc/client/plugins"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createRouterClient } from "@orpc/server"
import type { RouterClient } from "@orpc/server"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { createRpcContext } from "@/server/context"
import { appRouter } from "@/server/routers/_app"
import type { AppRouter } from "@/server/routers/_app"
import { createQueryClient } from "@/server/query-client"
import { routeTree } from "./routeTree.gen"

const readOperationPattern = /^(?:get|find|list|search)(?:[A-Z].*)?$/

const createOrpcClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(appRouter, {
      context: () => createRpcContext(getRequest()),
    })
  )
  .client(() =>
    createORPCClient<RouterClient<AppRouter>>(
      new RPCLink({
        url: () => `${window.location.origin}/api/rpc`,
        method: (_options, path) =>
          path.at(-1)?.match(readOperationPattern) ? "GET" : "POST",
        plugins: [
          new DedupeRequestsPlugin({
            filter: ({ request }) => request.method === "GET",
            groups: [{ condition: () => true, context: {} }],
          }),
          new BatchLinkPlugin({
            groups: [
              {
                condition: ({ request }) => request.method === "GET",
                context: {},
              },
            ],
          }),
        ],
      })
    )
  )

const getOrpcUtils = createIsomorphicFn()
  .server(() => createTanstackQueryUtils(createOrpcClient()))
  .client(() => createTanstackQueryUtils(createOrpcClient()))

export type RouterContext = {
  queryClient: ReturnType<typeof createQueryClient>
  orpc: ReturnType<typeof getOrpcUtils>
}

export function getRouter() {
  const queryClient = createQueryClient()
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      orpc: getOrpcUtils(),
    },

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
