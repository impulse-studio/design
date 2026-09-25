import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AiUsage } from "@/features/ai/types"

export function AiUsageDialog({ usage }: { usage: AiUsage[] }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        Chat IA · consommation
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consommation de la conversation</DialogTitle>
          <DialogDescription>
            Les appels OpenAI et Anthropic sont payés par le studio. Les budgets
            sont configurés chez les fournisseurs.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-72 space-y-3 overflow-y-auto text-sm">
          {usage.length === 0 && (
            <p className="text-muted-foreground">
              Aucune génération pour le moment.
            </p>
          )}
          {usage.map((item, index) => (
            <div
              key={`${item.createdAt}-${index}`}
              className="flex flex-col gap-1 border-b pb-2"
            >
              <span>{item.model}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                Entrée :{" "}
                {item.inputTokens?.toLocaleString("fr-FR") ?? "indisponible"} ·
                Sortie :{" "}
                {item.outputTokens?.toLocaleString("fr-FR") ?? "indisponible"}{" "}
                tokens
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
