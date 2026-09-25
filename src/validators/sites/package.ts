import { z } from "zod"

export const packageSchema = z
  .object({
    dependencies: z.record(z.string(), z.string()).default({}),
    devDependencies: z.record(z.string(), z.string()).optional(),
  })
  .passthrough()
