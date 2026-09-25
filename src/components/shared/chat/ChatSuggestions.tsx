import { RiArrowRightUpLine } from "@remixicon/react"
import { CHAT_SCENARIOS } from "@/features/chat/catalog"
import type { ChatScenario } from "@/validators/chat/messages"
import { Button } from "@/components/ui/button"

export function ChatSuggestions({
  onSelect,
  hasSelection,
  disabled = false,
}: {
  onSelect: (scenario: ChatScenario, prompt: string) => void
  hasSelection: boolean
  disabled?: boolean
}) {
  return (
    <div className="chat-suggestions flex w-full min-w-0 flex-col gap-2">
      {CHAT_SCENARIOS.map((scenario) => (
        <Button
          key={scenario.id}
          variant="outline"
          disabled={disabled || (scenario.id === "selection" && !hasSelection)}
          onClick={() => onSelect(scenario.id, scenario.prompt)}
          className="chat-suggestion h-auto min-h-[54px] w-full min-w-0 justify-between gap-2 p-2.5 text-left text-[12px] leading-[1.5] whitespace-normal"
          title={
            scenario.id === "selection" && !hasSelection
              ? "Sélectionnez un calque sur le canvas"
              : undefined
          }
        >
          <span className="min-w-0 flex-1">
            <span className="block">{scenario.label}</span>
            <span className="chat-suggestion-detail mt-0.5 block text-[11px] font-normal text-muted-foreground">
              {scenario.description}
            </span>
          </span>
          <RiArrowRightUpLine data-icon="inline-end" />
        </Button>
      ))}
    </div>
  )
}
