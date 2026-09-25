import { z } from "zod"

export const inputValidationDataSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.string(), z.array(z.string())),
})
