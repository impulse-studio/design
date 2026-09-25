import { siteKindSchema } from "@/validators/sites/kind"
import { z } from "zod"

import { filePathSchema } from "./paths"
import { libraryBindingSchema } from "@/validators/libraries/payload"

export { filePathSchema } from "./paths"
const breakpointSchema = z.enum(["base", "tablet", "mobile"])
const stylePropertySchema = z.enum([
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "gap",
  "width",
  "height",
  "maxWidth",
  "minHeight",
  "color",
  "backgroundColor",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "borderRadius",
  "display",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "gridTemplateColumns",
])
export const styleValueSchema = z
  .string()
  .trim()
  .max(150)
  .refine(
    (value) =>
      !/[{};<>\\]|\/\*|url\s*\(|expression\s*\(|!important/i.test(value),
    "Valeur CSS non autorisée."
  )
const cssVariableNameSchema = z
  .string()
  .regex(/^--[a-zA-Z][a-zA-Z0-9_-]{0,78}$/)
const visualStyleKeySchema = z.union([
  stylePropertySchema,
  cssVariableNameSchema,
])
export const visualEditSchema = z
  .object({
    id: z.string().regex(/^ds-[a-z0-9-]+$/),
    breakpoint: breakpointSchema,
    styles: z.partialRecord(visualStyleKeySchema, styleValueSchema),
  })
  .strict()
const routesSchema = z
  .array(
    z.object({
      path: z
        .string()
        .max(200)
        .regex(/^\/(?!\/)[^<>\s?#]*$/),
      name: z.string().min(1).max(100),
    })
  )
  .min(1)
  .max(50)
export const siteDocumentSchema = z
  .object({
    kind: siteKindSchema,
    version: z.literal(1),
    files: z.record(filePathSchema, z.string().max(2_000_000)),
    assets: z.record(
      filePathSchema,
      z.object({
        mime: z.enum([
          "font/woff2",
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/svg+xml",
        ]),
        base64: z
          .string()
          .max(3_000_000)
          .regex(/^[A-Za-z0-9+/]*={0,2}$/),
      })
    ),
    dependencies: z.record(z.string(), z.string()),
    routes: routesSchema,
    visual: z.array(visualEditSchema).max(5000),
    libraries: z.array(libraryBindingSchema).max(20).optional(),
  })
  .strict()
  .refine(
    (doc) =>
      Object.keys(doc.files).length <= 250 &&
      JSON.stringify(doc).length <= 10_000_000,
    "Projet trop volumineux."
  )
export type SiteDocument = z.infer<typeof siteDocumentSchema>
export type VisualEdit = z.infer<typeof visualEditSchema>
export type Breakpoint = z.infer<typeof breakpointSchema>
export type StyleProperty = z.infer<typeof stylePropertySchema>
export const siteProposalSchema = z
  .object({
    summary: z.string().trim().min(1).max(4000),
    operations: z
      .array(
        z.discriminatedUnion("type", [
          z
            .object({
              type: z.literal("writeFile"),
              path: filePathSchema,
              content: z.string().max(200_000),
            })
            .strict(),
          z
            .object({ type: z.literal("deleteFile"), path: filePathSchema })
            .strict(),
          z
            .object({
              type: z.literal("replaceInFile"),
              path: filePathSchema,
              oldText: z.string().min(1).max(200_000),
              newText: z.string().max(200_000),
            })
            .strict(),
        ])
      )
      .min(1)
      .max(80),
    routes: routesSchema.optional(),
  })
  .strict()
export type SiteProposal = z.infer<typeof siteProposalSchema>
export const siteChangeSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("file"),
      path: filePathSchema,
      content: z.string().max(200_000),
    })
    .strict(),
  z.object({ type: z.literal("visual"), edit: visualEditSchema }).strict(),
  z
    .object({
      type: z.literal("text"),
      id: z.string().max(100),
      text: z.string().max(10_000),
    })
    .strict(),
  z
    .object({ type: z.literal("restore"), versionId: z.string().uuid() })
    .strict(),
  z
    .object({ type: z.literal("proposal"), proposalId: z.string().uuid() })
    .strict(),
])
export type SiteChange = z.infer<typeof siteChangeSchema>
