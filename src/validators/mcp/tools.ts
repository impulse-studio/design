import { z } from "zod"
import { mockupReferenceSchema } from "./mockups"
import { readSiteOptionsSchema } from "./sites"

export const listSitesSchema = z.object({})
export const readSiteSchema = readSiteOptionsSchema.extend({
  site: mockupReferenceSchema,
})
export const listMockupsSchema = z.object({})
export const readMockupSchema = z.object({
  mockup: mockupReferenceSchema,
  mode: z.enum(["overview", "full"]).default("full"),
})
export const searchComponentsSchema = z.object({
  query: z.string().max(100).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  includeExamples: z.boolean().default(false),
})
