import { z } from "zod"

export const clientDataSchema = z
  .object({ runId: z.string().uuid() })
  .optional()

export type ClientData = z.infer<typeof clientDataSchema>
