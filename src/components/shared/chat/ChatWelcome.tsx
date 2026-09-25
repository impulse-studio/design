import { RiSparklingLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import type { ChatScenario } from "@/validators/chat/messages"
import { ChatSuggestions } from "./ChatSuggestions"

export function ChatWelcome({
  demo,
  ready,
  onEnableDemo,
  onSelect,
  hasSelection,
}: {
  demo: boolean
  ready: boolean
  onEnableDemo: () => void
  onSelect: (scenario: ChatScenario, prompt: string) => void
  hasSelection: boolean
}) {
  return (
    <Empty className="chat-welcome items-stretch px-0.5 pt-7 pb-4 text-left [&_[data-slot=empty-content]]:items-stretch [&_[data-slot=empty-content]]:gap-[18px] [&_[data-slot=empty-description]]:text-[12px] [&_[data-slot=empty-description]]:leading-[1.7] [&_[data-slot=empty-header]]:items-start [&_[data-slot=empty-title]]:text-[18px] [&_[data-slot=empty-title]]:tracking-[-0.03em]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiSparklingLine />
        </EmptyMedia>
        <EmptyTitle>De l’idée à l’interface.</EmptyTitle>
        <EmptyDescription>
          {demo
            ? "Explorez un parcours complet : questions, proposition et aperçu du résultat."
            : "Décrivez une page ou affinez votre sélection. Préparez votre demande, ou découvrez le chat en démonstration."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {!demo && (
          <Button onClick={onEnableDemo} disabled={!ready}>
            Essayer la démo
          </Button>
        )}
        <ChatSuggestions
          hasSelection={hasSelection}
          onSelect={onSelect}
          disabled={!ready}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {demo
            ? "Échanges simulés · aucune modification du canvas."
            : "Aucun fournisseur IA connecté."}
        </p>
      </EmptyContent>
    </Empty>
  )
}
