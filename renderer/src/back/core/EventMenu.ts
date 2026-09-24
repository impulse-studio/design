import type { Event, EventPermission, EventRights } from 'api_sdk'
import type { RouteRecordName } from 'vue-router'

import type { Renderable } from '@/models/VueTools'

export interface EventMenuSection {
  readonly key: string
  readonly titleSlug: string
  readonly iconName: string
  readonly items: readonly EventMenuItem[]
}

interface EventMenuItemBase {
  readonly titleSlug: string
  readonly isAllowedInEvent?: (
    eventRights: EventRights,
    event: Event,
  ) => boolean
  readonly requiredPermissions?: readonly EventPermission[]
}

interface EventMenuItemLink extends EventMenuItemBase {
  readonly routeName: RouteRecordName
}

interface EventMenuItemComponent extends EventMenuItemBase {
  readonly component: Renderable
}

export function isEventMenuItemLink(
  item: EventMenuItem,
): item is EventMenuItemLink {
  return 'routeName' in item
}

export type EventMenuItem = EventMenuItemLink | EventMenuItemComponent
