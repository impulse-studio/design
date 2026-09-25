import { z } from "zod"

import { styleValueSchema } from "@/validators/sites/document"

import { siteKindSchema } from "@/validators/sites/kind"

export const createSiteFormSchema = z.object({
  name: z.string().trim().min(1, "Indiquez un nom.").max(200),
  kind: siteKindSchema,
})

export const sitePromptSchema = z.object({
  prompt: z.string().trim().min(1, "Décrivez votre modification.").max(20000),
})

export const fileEditorFormSchema = z.object({
  content: z.string().max(200_000, "Fichier trop volumineux."),
})

export const inspectorFormSchema = z.object({
  styles: z.record(z.string(), styleValueSchema),
  text: z.string().max(10000),
})

export const inspectorTextSchema = z.string().max(10000)
