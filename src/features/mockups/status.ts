import type { MockupStatus } from "@/validators/mockups"

export const mockupStatuses: { value: MockupStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "in_progress", label: "En cours" },
  { value: "in_review", label: "À valider" },
  { value: "approved", label: "Validée" },
]
