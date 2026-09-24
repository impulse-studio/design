import type { RouteLocationNormalized } from 'vue-router'

import type { EventMenuItem } from '@/core/EventMenu'
import { isEventMenuItemLink } from '@/core/EventMenu'

export function isItemActive(
  item: EventMenuItem,
  route: RouteLocationNormalized,
): boolean {
  if (!isEventMenuItemLink(item)) return false
  return (
    route.name === item.routeName || route.meta?.subPageOf === item.routeName
  )
}
