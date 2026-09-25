import { z } from "zod"
import { siteKindSchema } from "@/validators/sites/kind"

export const libraryFormSchema = z.object({
  name: z.string().trim().min(1, "Indiquez un nom.").max(100),
  framework: siteKindSchema,
})
