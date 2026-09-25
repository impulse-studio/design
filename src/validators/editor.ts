import { z } from "zod"
import { frameSchema, nodeSchema } from "@digit-ai-studio/shared"

export const clipboardSchema = z.object({
  type: z.literal("digit-nodes"),
  nodes: z.array(z.union([frameSchema, nodeSchema])),
})
