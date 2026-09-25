import { cn } from "@/lib/utils"
import type { AiProvider } from "@/features/ai/types"

export function AiProviderLogo({
  provider,
  className,
}: {
  provider: AiProvider
  className?: string
}) {
  return (
    <img
      src={`/brands/${provider}.png`}
      width={24}
      height={24}
      alt={provider === "openai" ? "OpenAI" : "Anthropic"}
      className={cn("size-5 shrink-0 object-contain", className)}
    />
  )
}
