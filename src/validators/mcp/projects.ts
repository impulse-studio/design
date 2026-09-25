import { z } from "zod"

export const createMcpProjectSchema = z.object({
  name: z.string().trim().min(1).max(200),
  kind: z.enum(["site", "mockup"]),
  teamId: z.string().optional(),
})
