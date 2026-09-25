import { z } from "zod"
import type { Json } from "./doc"

export type ManifestProp = {
  name: string
  type: string
  required: boolean
  default?: Json
}
export type ManifestComponent = {
  name: string
  category?: string
  file?: string | null
  source?: string
  description?: string | null
  props: ManifestProp[]
  slots: string[]
  previewProps?: Record<string, Json>
}
export type LibraryManifest = {
  orchestrationSha: string
  components: ManifestComponent[]
  templates: ManifestComponent[]
  tokens: Record<string, Record<string, string>>
}
export const propOptions = (prop: ManifestProp): string[] => {
  const parts = prop.type
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part !== "undefined" && part !== "null")
  return parts.every((part) => /^(["']).*\1$/.test(part))
    ? parts.map((part) => part.slice(1, -1))
    : []
}

const entrySchema = z.object({
  name: z.string(),
  category: z.string().optional(),
  file: z.string().nullable().optional(),
  source: z.string().optional(),
  description: z.string().nullable().optional(),
  props: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      default: z.json().optional(),
    })
  ),
  slots: z.array(z.string()),
  previewProps: z.record(z.string(), z.json()).optional(),
})
export const librarySchema = z.object({
  orchestrationSha: z.string(),
  components: z.array(entrySchema),
  templates: z.array(entrySchema),
  tokens: z.record(z.string(), z.record(z.string(), z.string())),
})
