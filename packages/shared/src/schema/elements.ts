import { z } from "zod"

import { finite } from "./values"

export const elementTagSchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]{0,40}$/)
  .refine(
    (tag) =>
      ![
        "script",
        "style",
        "iframe",
        "object",
        "embed",
        "link",
        "meta",
      ].includes(tag),
    "Balise non autorisée"
  )

export const elementAttributesSchema = z
  .record(
    z.string().regex(/^[a-zA-Z_:][a-zA-Z0-9:._-]{0,100}$/),
    z.union([z.string().max(2000), finite, z.boolean()])
  )
  .refine(
    (attributes) =>
      Object.keys(attributes).every(
        (key) => !/^on/i.test(key) && key.toLowerCase() !== "srcdoc"
      ),
    "Attribut dangereux"
  )
  .refine(
    (attributes) =>
      Object.entries(attributes).every(
        ([key, value]) =>
          !["href", "src", "xlink:href"].includes(key.toLowerCase()) ||
          typeof value !== "string" ||
          /^(?:https?:\/\/|mailto:|tel:|#|\/|\.\/|\.\.\/|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(
            value
          )
      ),
    "URL non autorisée"
  )

export const elementInlineStyleSchema = z
  .string()
  .max(4000)
  .refine(
    (value) =>
      !/(?:url\s*\(|expression\s*\(|javascript:|@import|<)/i.test(value),
    "Style non autorisé"
  )

export type DetachedSnapshot =
  | { text: string }
  | { slot: string }
  | {
      tag: string
      className?: string
      attributes?: Record<string, string | number | boolean>
      inlineStyle?: string
      children: DetachedSnapshot[]
    }

export const detachedSnapshotSchema: z.ZodType<DetachedSnapshot> = z.lazy(() =>
  z.union([
    z.object({ text: z.string().max(100_000) }).strict(),
    z.object({ slot: z.string().min(1).max(100) }).strict(),
    z
      .object({
        tag: elementTagSchema,
        className: z.string().max(4000).optional(),
        attributes: elementAttributesSchema.optional(),
        inlineStyle: elementInlineStyleSchema.optional(),
        children: z.array(detachedSnapshotSchema).max(10_000),
      })
      .strict(),
  ])
)
