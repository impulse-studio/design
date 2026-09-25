import { z } from "zod"

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

export type MockupLinksFormInput = z.input<typeof mockupLinksFormSchema>
export type MockupLinks = z.infer<typeof mockupLinksSchema>

export const mockupNameSchema = z
  .string()
  .trim()
  .min(1, "Saisissez le nom du projet.")
  .max(200, "Le nom doit contenir au maximum 200 caractères.")
export const mockupNameFormSchema = z.object({ name: mockupNameSchema })
