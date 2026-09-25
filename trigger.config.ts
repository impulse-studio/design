import { defineConfig } from "@trigger.dev/sdk"

export default defineConfig({
  project: "proj_zgxhwxbqwkorcrzjyaxh",
  runtime: "node-22",
  dirs: ["./src/trigger"],
  maxDuration: 660,
  retries: { enabledInDev: false, default: { maxAttempts: 1 } },
})
