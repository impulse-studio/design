import { z } from "zod"

import { libraryPayloadSchema } from "./payload"

export const importLibrarySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    libraryId: z.string().uuid().optional(),
    expectedVersion: z.number().int().nonnegative().default(0),
    payload: libraryPayloadSchema,
  })
  .strict()

export const libraryUpdateSchema = z
  .object({
    projectId: z.string().min(1).max(100),
    versionId: z.string().uuid(),
    expectedRevision: z.number().int().nonnegative(),
    resolutions: z
      .record(z.string(), z.enum(["local", "incoming"]))
      .default({}),
  })
  .strict()

export const connectLibrarySchema = z.object({ libraryId: z.string().uuid() })

export const disconnectLibrarySchema = z.object({ id: z.string().uuid() })

export const setLibraryPermissionSchema = z.object({
  organizationId: z.string(),
  memberId: z.string(),
  enabled: z.boolean(),
})

export const listLibrariesSchema = z
  .object({ projectId: z.string().max(100).optional() })
  .default({})
