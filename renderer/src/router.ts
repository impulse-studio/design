import { createMemoryHistory, createRouter  } from "vue-router"
import type {RouteRecordName} from "vue-router";

import { SHELL_ROUTE_NAMES } from "./constants"

const Empty = { render: () => null }

// Shell components link to backoffice routes by name; any name a mockup uses is registered on the fly.
export const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: "/", name: "studioHome", component: Empty }],
})

for (const name of SHELL_ROUTE_NAMES) ensureRoute(name)

export function ensureRoute(name: NonNullable<RouteRecordName>): void {
  if (router.hasRoute(name)) return
  router.addRoute({ path: `/${String(name)}`, name, component: Empty })
}
