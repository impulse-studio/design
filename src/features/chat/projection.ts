import type { ChatMessage } from "@/validators/chat/messages"

export type GenerationTurn = {
  id: string
  prompt: string
  answer: string
  status: "queued" | "running" | "completed" | "interrupted" | "failed"
}

export const projectGenerationConversation = (
  turns: GenerationTurn[]
): ChatMessage[] =>
  turns.flatMap((turn) => [
    {
      id: `${turn.id}:user`,
      role: "user" as const,
      text: turn.prompt,
      status: "complete" as const,
    },
    {
      id: `${turn.id}:assistant`,
      role: "assistant" as const,
      text: turn.answer,
      status:
        turn.status === "running"
          ? turn.answer
            ? ("streaming" as const)
            : ("thinking" as const)
          : turn.status === "queued"
            ? ("waiting" as const)
            : turn.status === "failed"
              ? ("error" as const)
              : turn.status === "interrupted"
                ? ("stopped" as const)
                : ("complete" as const),
      ...(turn.status === "failed"
        ? { errorTitle: "La génération a échoué" }
        : {}),
    },
  ])
