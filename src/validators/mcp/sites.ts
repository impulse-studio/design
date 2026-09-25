import { z } from "zod"

import { siteProposalSchema } from "@/validators/sites/document"

import { mockupReferenceSchema } from "@/validators/mcp/mockups"

export const applySiteChangesSchema = siteProposalSchema.extend({
  site: mockupReferenceSchema,
  expectedRevision: z.number().int().nonnegative(),
})

export const readSiteOptionsSchema = z.object({
  mode: z.enum(["overview", "full"]).default("full"),
  paths: z.array(z.string().max(200)).max(30).optional(),
})
