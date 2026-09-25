import { task } from "@trigger.dev/sdk"

export const studioHealthCheck = task({
  id: "studio-health-check",
  run: async () => ({
    status: "ok",
    checkedAt: new Date().toISOString(),
  }),
})
