import { z } from "zod"

import { siteKindSchema } from "@/validators/sites/kind"

import { siteChangeSchema } from "@/validators/sites/document"

export const changeSiteSchema = z.object({
  id: z.string().min(1).max(100),
  expectedRevision: z.number().int().nonnegative(),
  change: siteChangeSchema,
})

export const createSiteSchema = z.object({
  name: z.string().trim().min(1).max(200),
  kind: siteKindSchema.default("react-vite"),
})

export const getSiteHistorySchema = z.object({ id: z.string().min(1).max(100) })

export const getSiteVersionSchema = z.object({
  id: z.string().min(1).max(100),
  versionId: z.string().uuid(),
})

export const getSiteSchema = z.object({ id: z.string().min(1).max(100) })

export const listPendingSiteProposalsSchema = z.object({
  id: z.string().min(1).max(100),
})
