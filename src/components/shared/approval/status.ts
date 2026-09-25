import type { ApprovalCardAnswer, ApprovalCardStatus } from "./types"
import { answeredSchema } from "@/validators/approval"

export const EMPTY_ANSWER: ApprovalCardAnswer = { selected: [], custom: "" }

export const getStatusLabel = (status: ApprovalCardStatus) => {
  if (status === "submitting") return "Envoi en cours"
  if (status === "approved") return "Approuvé"
  if (status === "rejected") return "Refusé"
  if (status === "changes-requested") return "Modifications demandées"
  if (status === "answered") return "Réponse envoyée"
  return "Réponse attendue"
}

export const getStatusClass = (status: ApprovalCardStatus) => {
  if (status === "approved" || status === "answered") {
    return "text-primary"
  }
  if (status === "rejected") return "text-destructive"
  if (status === "changes-requested") {
    return "text-muted-foreground"
  }
  return "text-muted-foreground"
}

export const isAnswered = (answer: ApprovalCardAnswer) => {
  return answeredSchema.safeParse(answer).success
}
