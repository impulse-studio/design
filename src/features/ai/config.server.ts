import { z } from "zod"
import type { AiConfiguration } from "./types"

const modelsSchema = z
  .array(
    z.object({
      id: z.string().regex(/^(openai|anthropic):[^\s:]+$/),
      displayName: z.string().min(1).max(100),
    })
  )
  .max(30)

/** Identical catalog on web and worker. Provider keys only need to exist on the worker. */
export const readAiConfiguration = (): AiConfiguration => {
  try {
    const configured = modelsSchema.parse(
      JSON.parse(process.env.AI_MODELS ?? "[]")
    )
    const enabled = new Set((process.env.AI_ENABLED_PROVIDERS ?? "").split(","))
    const models = configured
      .filter((item) => enabled.has(item.id.split(":")[0]))
      .map((item) => ({
        ...item,
        model: item.id,
        provider: item.id.startsWith("openai:")
          ? ("openai" as const)
          : ("anthropic" as const),
        isDefault: item.id === process.env.AI_DEFAULT_MODEL,
      }))
    const available = Boolean(
      process.env.TRIGGER_SECRET_KEY &&
      process.env.AI_CALLBACK_SECRET &&
      models.length
    )
    return {
      available,
      models: available ? models : [],
      error: available
        ? null
        : "Le chat IA n’est pas encore configuré par le studio.",
    }
  } catch {
    return {
      available: false,
      models: [],
      error: "La configuration des modèles IA est invalide.",
    }
  }
}
export const requireModel = (id: string) => {
  const model = readAiConfiguration().models.find((item) => item.id === id)
  if (!model) throw new Error("Modèle indisponible dans ce studio.")
  return model
}
