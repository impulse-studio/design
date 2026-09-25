import { z } from "zod"

import { documentSchema } from "@digit-ai-studio/shared"

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

const mockupLinkFormValueSchema = z
  .string()
  .trim()
  .max(2048, "Le lien doit contenir au maximum 2048 caractères.")
  .refine((value) => value.length === 0 || isHttpUrl(value), {
    message: "Saisissez une URL complète commençant par http:// ou https://.",
  })
  .transform((value) => value || null)

const mockupLinkValueSchema = z
  .string()
  .trim()
  .max(2048, "Le lien doit contenir au maximum 2048 caractères.")
  .url("Saisissez une URL valide.")
  .refine(isHttpUrl, "Utilisez un lien HTTP ou HTTPS.")
  .nullable()

export const mockupLinksFormSchema = z.object({
  notionUrl: mockupLinkFormValueSchema,
  githubUrl: mockupLinkFormValueSchema,
})

export const mockupLinksSchema = z.object({
  notionUrl: mockupLinkValueSchema,
  githubUrl: mockupLinkValueSchema,
})
export type MockupLinks = z.infer<typeof mockupLinksSchema>

const mockupNameSchema = z
  .string()
  .trim()
  .min(1, "Saisissez le nom du projet.")
  .max(200, "Le nom doit contenir au maximum 200 caractères.")
export const mockupNameFormSchema = z.object({ name: mockupNameSchema })

export const mockupStatusSchema = z.enum([
  "draft",
  "in_progress",
  "in_review",
  "approved",
])

export type MockupStatus = z.infer<typeof mockupStatusSchema>

export const saveMockupSchema = z.object({
  id: z.string().min(1).max(100),
  name: mockupNameSchema,
  status: mockupStatusSchema,
  doc: documentSchema,
  expectedRevision: z.number().int().nonnegative(),
})

export const setMockupStatusSchema = z.object({
  id: z.string().min(1).max(100),
  status: mockupStatusSchema,
  expectedRevision: z.number().int().nonnegative(),
})

export const updateMockupLinksSchema = z.object({
  id: z.string().min(1).max(100),
  ...mockupLinksSchema.shape,
})

export const getMockupRevisionSchema = z.object({
  id: z.string().min(1).max(100),
})

export const getMockupSchema = z.object({ id: z.string().min(1).max(100) })
