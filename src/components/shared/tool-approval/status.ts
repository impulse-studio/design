import type { ToolApprovalStatus } from "./types"

export const getStatusCopy = (status: ToolApprovalStatus) => {
  if (status === "approving") return "Autorisation en cours"
  if (status === "approved") return "Autorisé"
  if (status === "denied") return "Refusé"
  if (status === "running") return "Exécution en cours"
  if (status === "complete") return "Terminé"
  if (status === "error") return "Échec"
  return "Autorisation requise"
}
