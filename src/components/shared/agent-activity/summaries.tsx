import type { ReactNode } from "react"
import type { AgentActivityItem, AgentActivityContentType } from "./types"

const formatDuration = (duration: number) => {
  const seconds = Math.max(0, Math.round(duration))
  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return remainder === 0 ? `${minutes}m` : `${minutes}m ${remainder}s`
}

export const getContentType = (
  items: AgentActivityItem[]
): AgentActivityContentType => {
  const first = items.at(0)?.type
  return first && items.every((item) => item.type === first) ? first : "mixed"
}

export const getActiveLabel = (type: AgentActivityContentType) => {
  if (type === "search") return "Recherche sur le web…"
  if (type === "tool") return "Exécution des outils…"
  if (type === "trace") return "Exécution en cours…"
  if (type === "mixed") return "Travail en cours…"
  return "Analyse en cours…"
}

export const getSummary = (
  type: AgentActivityContentType,
  items: AgentActivityItem[],
  duration: number
): ReactNode => {
  if (type === "step" || type === "text") {
    return (
      <>
        Analyse pendant{" "}
        <span className="tabular-nums">{formatDuration(duration)}</span>
      </>
    )
  }
  if (type === "search") return "Recherche terminée"
  if (type === "tool") {
    return `${items.length} outil${items.length > 1 ? "s" : ""} exécuté${items.length > 1 ? "s" : ""}`
  }
  if (type === "trace") {
    const messages = items.filter(
      (item) =>
        item.type === "trace" &&
        (item.kind === "thinking" || item.kind === "message")
    ).length
    const tools = items.length - messages
    return `${tools} ${tools === 1 ? "appel d’outil" : "appels d’outils"}, ${messages} ${messages === 1 ? "message" : "messages"}`
  }
  return `${items.length} étape${items.length > 1 ? "s" : ""} terminée${items.length > 1 ? "s" : ""}`
}
