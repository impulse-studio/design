import { siteKindSchema } from "@/validators/sites/kind"
import { z } from "zod"
import { filePathSchema } from "@/validators/sites/paths"

const packageNameSchema = z
  .string()
  .regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/)
const dependencyVersionSchema = z
  .string()
  .max(100)
  .regex(/^[~^<>=|*\d.xX -]+(?:-[a-zA-Z0-9.-]+)?$/)
export const libraryComponentSchema = z
  .object({
    name: z.string().min(1).max(100),
    path: filePathSchema,
    exportName: z.string().regex(/^(default|[A-Za-z_$][\w$]*)$/),
    description: z.string().max(2000).default(""),
    props: z.record(z.string().max(100), z.string().max(500)).default({}),
    example: filePathSchema.optional(),
  })
  .strict()
export const libraryPayloadSchema = z
  .object({
    framework: siteKindSchema,
    files: z.record(filePathSchema, z.string().max(2_000_000)),
    assets: z
      .record(
        filePathSchema,
        z
          .object({
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
          .strict()
      )
      .default({}),
    dependencies: z
      .record(packageNameSchema, dependencyVersionSchema)
      .default({}),
    components: z.array(libraryComponentSchema).max(250).default([]),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      Object.keys(value.files).length + Object.keys(value.assets).length >
        250 ||
      JSON.stringify(value).length > 10_000_000
    )
      ctx.addIssue({
        code: "custom",
        message: "Bibliothèque trop volumineuse (250 fichiers, 10 Mo maximum).",
      })
    for (const path of [
      ...Object.keys(value.files),
      ...Object.keys(value.assets),
    ]) {
      if (
        path
          .split("/")
          .some(
            (part) =>
              part.startsWith(".") ||
              [
                "node_modules",
                "dist",
                "__proto__",
                "constructor",
                "prototype",
              ].includes(part)
          ) ||
        /(?:^|\/)(?:credentials|secrets)(?:\.|\/|$)|\.(?:pem|key|p12)$/i.test(
          path
        )
      )
        ctx.addIssue({ code: "custom", message: `Fichier interdit : ${path}` })
    }
    for (const component of value.components) {
      if (
        !Object.hasOwn(value.files, component.path) ||
        (component.example && !Object.hasOwn(value.files, component.example))
      )
        ctx.addIssue({
          code: "custom",
          message: `Source ou exemple absent : ${component.name}`,
        })
    }
  })
const runtimeSchema = z
  .object({
    imports: z.record(z.string(), z.string()),
    modules: z.record(z.string(), z.string()),
  })
  .strict()
export const librarySnapshotSchema = z
  .object({
    id: z.string().uuid(),
    libraryId: z.string().uuid(),
    name: z.string().max(100),
    version: z.number().int().positive(),
    payload: libraryPayloadSchema,
    runtime: runtimeSchema.optional(),
  })
  .strict()
export const libraryBindingSchema = z
  .object({
    snapshot: librarySnapshotSchema,
    baseFiles: z.record(filePathSchema, z.string()),
    baseAssets: libraryPayloadSchema.shape.assets,
  })
  .strict()
export type LibraryPayload = z.infer<typeof libraryPayloadSchema>
export type LibrarySnapshot = z.infer<typeof librarySnapshotSchema>
