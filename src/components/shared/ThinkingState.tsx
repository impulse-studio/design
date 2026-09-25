"use client"

export function ThinkingState({
  label = "Réflexion en cours…",
}: {
  label?: string
}) {
  return (
    <span
      role="status"
      className="text-xs text-muted-foreground motion-safe:animate-pulse"
    >
      {label}
    </span>
  )
}
