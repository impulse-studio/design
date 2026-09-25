import { z } from "zod"

export const mockupStatusSchema = z.enum([
  "draft",
  "in_progress",
  "in_review",
  "approved",
])
export type MockupStatus = z.infer<typeof mockupStatusSchema>
export const mockupStatuses: { value: MockupStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "in_progress", label: "En cours" },
  { value: "in_review", label: "À valider" },
  { value: "approved", label: "Validée" },
]
