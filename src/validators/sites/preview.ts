import { z } from "zod"

const previewRectSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
    viewportWidth: z.number().positive(),
    viewportHeight: z.number().positive(),
  })
  .strict()

export type PreviewRect = z.infer<typeof previewRectSchema>

const previewInventoryEntrySchema = z
  .object({
    id: z.string().max(100),
    count: z.number().int().positive(),
  })
  .strict()

export type PreviewInventoryEntry = z.infer<typeof previewInventoryEntrySchema>

export const previewMessageSchema = z.object({
  source: z.literal("digit-site"),
  token: z.string(),
  revision: z.number().int(),
  type: z.enum(["ready", "selection", "hover", "inventory", "route", "error"]),
  id: z.string().max(100).optional(),
  count: z.number().int().optional(),
  tag: z.string().max(100).optional(),
  rect: previewRectSchema.optional(),
  elements: z.array(previewInventoryEntrySchema).max(10000).optional(),
  path: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
})
