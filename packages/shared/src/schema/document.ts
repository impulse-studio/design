import { z } from "zod"
import type { MockupDoc } from "../doc"

import { walk } from "../tree"
import { base } from "./values"

import { frameSchema } from "./nodes"

export const documentSchema: z.ZodType<MockupDoc> = z
  .object({
    schemaVersion: z.literal(1),
    libVersion: z.string().max(100),
    pages: z
      .array(
        z
          .object({
            id: base.id,
            name: z.string().min(1).max(200),
            background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
            frames: z.array(frameSchema).max(100),
          })
          .strict()
      )
      .length(1),
  })
  .strict()
  .superRefine((doc, ctx) => {
    const ids = new Set<string>()
    const variants = new Map<string, string>()
    for (const page of doc.pages)
      for (const frame of page.frames)
        walk(frame, (node, _parent, depth) => {
          if (ids.has(node.id))
            ctx.addIssue({
              code: "custom",
              message: "Identifiant de calque dupliqué",
            })
          ids.add(node.id)
          if (depth > 50 || ids.size > 10_000)
            ctx.addIssue({ code: "custom", message: "Document trop complexe" })
          if (node.type === "component" && node.localVariant) {
            const serialized = JSON.stringify(node.localVariant)
            const previous = variants.get(node.localVariant.id)
            if (previous && previous !== serialized)
              ctx.addIssue({
                code: "custom",
                path: ["pages"],
                message: `La variante locale « ${node.localVariant.name} » a plusieurs définitions`,
              })
            variants.set(node.localVariant.id, serialized)
          }
        })
  })
