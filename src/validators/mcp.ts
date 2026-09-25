import { z } from "zod"

export const revokeMcpConnectionSchema = z.object({
  id: z.string().min(1).max(100),
})
