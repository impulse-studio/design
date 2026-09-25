import type { ImageGenerationStatus } from "./types"

export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const STATUS_TEXT: Record<ImageGenerationStatus, string> = {
  queued: "En attente",
  generating: "Génération en cours",
  refining: "Affinage des détails",
  complete: "Image prête",
  error: "Échec de la génération",
}

export const MEDIA_STATE: Record<
  ImageGenerationStatus,
  { filter: string; opacity: number; scale: number }
> = {
  queued: { filter: "blur(4px) saturate(0.75)", opacity: 0, scale: 1.02 },
  generating: { filter: "blur(3px) saturate(0.85)", opacity: 0, scale: 1.015 },
  refining: {
    filter: "blur(1.5px) saturate(0.95)",
    opacity: 0.62,
    scale: 1.005,
  },
  complete: { filter: "blur(0px) saturate(1)", opacity: 1, scale: 1 },
  error: { filter: "blur(2px) saturate(0.5)", opacity: 0.28, scale: 1 },
}

export const OVERLAY_OPACITY: Record<ImageGenerationStatus, number> = {
  queued: 1,
  generating: 1,
  refining: 0.48,
  complete: 0,
  error: 0,
}
