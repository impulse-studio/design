import { z } from "zod"

export const consentSearchSchema = z.object({
  client_id: z.string().optional(),
  scope: z.string().optional(),
})
