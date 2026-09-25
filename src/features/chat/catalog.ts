import type { ChatEffort, ChatScenario } from "./types"

export const CHAT_MODELS = [
  { value: "demo-gpt", label: "GPT", provider: "OpenAI" },
  { value: "demo-gpt-fast", label: "GPT rapide", provider: "OpenAI" },
  { value: "demo-opus", label: "Opus", provider: "Claude" },
  { value: "demo-sonnet", label: "Sonnet", provider: "Claude" },
  { value: "demo-gemini-pro", label: "Gemini Pro", provider: "Gemini" },
  { value: "demo-gemini-flash", label: "Flash", provider: "Gemini" },
] as const
export const CHAT_EFFORTS: { value: ChatEffort; label: string }[] = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyen" },
  { value: "high", label: "Élevé" },
  { value: "xhigh", label: "Très élevé" },
]
export const CHAT_SCENARIOS: {
  id: ChatScenario
  label: string
  prompt: string
  description: string
}[] = [
  {
    id: "create",
    label: "Créer une page",
    prompt: "Créer une page de gestion des participants.",
    description: "Questions, plan et étapes",
  },
  {
    id: "selection",
    label: "Affiner la sélection",
    prompt: "Améliorer la lisibilité de ma sélection.",
    description: "Contexte et aperçu des modifications",
  },
  {
    id: "illustration",
    label: "Explorer une idée",
    prompt: "Proposer une page illustrée avec des sources.",
    description: "Image et références",
  },
  {
    id: "error",
    label: "Tester une erreur",
    prompt: "Tester une interruption et relancer la réponse.",
    description: "Erreur récupérable",
  },
]
export const modelLabel = (value: string) => {
  const model = CHAT_MODELS.find((item) => item.value === value)
  return model
    ? `${model.provider} · ${model.label}`
    : "Modèle de démonstration"
}
