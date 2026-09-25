import { z } from "zod"

import { operationSchema } from "@/validators/ai/operations"

export const mockupReferenceSchema = z.string().min(1).max(500)

export const applyChangesSchema = z.object({
  mockup: mockupReferenceSchema,
  expectedRevision: z.number().int().nonnegative(),
  summary: z.string().trim().min(1).max(4000),
  operations: z.array(operationSchema).min(1).max(100),
})
