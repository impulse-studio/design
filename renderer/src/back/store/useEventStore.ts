// Stub of back/src/store/useEventStore.ts: the shell templates feed it from their props instead of the API.
import { computed, reactive, type ComputedRef } from "vue"

import { DEFAULT_EVENT } from "~/templates/constants"

export const mockEvent = reactive({
  _id: DEFAULT_EVENT.id,
  name: String(DEFAULT_EVENT.name),
  startDate: String(DEFAULT_EVENT.startDate),
  timezone: DEFAULT_EVENT.timezone,
  isDemo: false,
})

const store = {
  isLoadingEvent: false,
  get event() {
    return { _id: mockEvent._id, label: mockEvent.name }
  },
  mustGetEvent: (): ComputedRef<{ _id: string; label: string }> =>
    computed(() => ({ _id: mockEvent._id, label: mockEvent.name })),
  mustGetIdentity: () =>
    computed(() => ({
      name: mockEvent.name,
      startDate: mockEvent.startDate,
      timezone: mockEvent.timezone,
      isDemo: mockEvent.isDemo,
    })),
  mustGetRights: () => computed(() => ({})),
}

export function useEventStore() {
  return store
}
