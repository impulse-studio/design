import { z } from "zod"
import { libraryComponentSchema } from "@/validators/libraries/payload"

export const manifestSchema = z.object({
  components: z.array(libraryComponentSchema).default([]),
})

export const packageSchema = z.object({
  dependencies: z.record(z.string(), z.string()).default({}),
  peerDependencies: z.record(z.string(), z.string()).default({}),
})
