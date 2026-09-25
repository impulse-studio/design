import { z } from "zod"
import { frameSchema } from "./schema"

export type Rect = { x: number; y: number; width: number; height: number }
const rect = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
})
export const geometryPreviewSchema = z.object({
  nodeId: z.string(),
  x: z.number().finite().optional(),
  y: z.number().finite().optional(),
  width: z.number().positive().finite().optional(),
  height: z.number().positive().finite().optional(),
  translateX: z.number().finite().optional(),
  translateY: z.number().finite().optional(),
})
export type GeometryPreview = z.infer<typeof geometryPreviewSchema>
const header = { frameId: z.string(), revision: z.number().int().nonnegative() }
export const shellMessageSchema = z.discriminatedUnion("type", [
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("geometry-preview"),
    session: z.number().int().nonnegative(),
    sequence: z.number().int().nonnegative(),
    patches: z.array(geometryPreviewSchema),
  }),
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("init"),
    frame: frameSchema,
    mode: z.enum(["edit", "preview"]),
    theme: z.enum(["light", "dark"]),
  }),
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("replace"),
    frame: frameSchema,
  }),
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("mode"),
    mode: z.enum(["edit", "preview"]),
  }),
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("edit-text"),
    nodeId: z.string(),
  }),
  z.object({
    ...header,
    source: z.literal("digit-studio"),
    type: z.literal("detach-component"),
    nodeId: z.string(),
    requestId: z.string(),
  }),
])
export const rendererMessageSchema = z.discriminatedUnion("type", [
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("exitPreview"),
  }),
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("ready"),
  }),
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("rendered"),
    previewSession: z.number().int().nonnegative().optional(),
    previewSequence: z.number().int().nonnegative().optional(),
    contentWidth: z.number(),
    contentHeight: z.number(),
    rects: z.record(z.string(), rect),
    computed: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  }),
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("textCommit"),
    nodeId: z.string(),
    value: z.string(),
  }),
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("detached"),
    nodeId: z.string(),
    requestId: z.string(),
    snapshot: z.json(),
  }),
  z.object({
    ...header,
    source: z.literal("digit-renderer"),
    type: z.literal("error"),
    nodeId: z.string(),
    message: z.string(),
  }),
])
export type ShellMessage = z.infer<typeof shellMessageSchema>
export type RendererMessage = z.infer<typeof rendererMessageSchema>
